const express = require('express');
const fileUpload = require('express-fileupload');
const ffmpeg = require('fluent-ffmpeg');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);
app.use('/temp-output', express.static('temp-output'));

app.get('/video-converter', (req, res) => {
  res.sendFile(__dirname + '../video-converter/index.html');
});

app.post('/convert', (req, res) => {
  let inputFile = req.files.videoFile;
  let selectMenuValues = req.body.selectMenu;
  let startingTime = req.body.StartingTime;
  let endingTime = req.body.EndingTime;
  let resolution = req.body.ResolutionMenu;
  let [widthValue, heightValue] = resolution.split('x');
  let videoCOdec = req.body.videotCodecSelect;
  let aspectRatio = req.body.AspectRatioSelect;
  let qualityConstant = req.body.ConstantQualitySelect;

  io.emit('message', 'File Upload Started');
  inputFile.mv('temp-files/' + inputFile.name, function (err) {
    if (err) {
      io.emit('message', 'File Upload Error: ' + err.message);
      return res.status(500).send(err);
    } else {
      io.emit('message', 'File Uploaded Successfully.');

      const inputPath = `./temp-files/${inputFile.name}`;
      const lastDotIndex = inputFile.name.lastIndexOf('.');
      const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
      const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;

      res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues });

      const command = new ffmpeg(inputPath)
        .on('start', (commandLine) => {
          console.log('Conversion Started.');
        })
        .on('progress', (progress) => {
          if (progress.percent !== undefined) {
            console.log('Conversion progress:', progress.percent.toFixed(2) + '%');
            io.emit('message', 'Conversion Progress: ' + progress.percent.toFixed(2) + '%');
          }
        })
        .on('end', () => {
          io.emit('message', 'Conversion Finished.');
          console.log('Conversion finished.');
        })
        .on('error', (err) => {
          io.emit('message', 'Conversion Error: ' + err.message);
          console.error('Error:', err);
          res.status(500).send('Conversion Error: ' + err.message);
        });
      // trimming
      if (startingTime && endingTime && endingTime !== '00:00:00') {
        command.setStartTime(startingTime);
        command.setDuration(endingTime);
      }
      if (videoCOdec === 'copy') {
        command.videoCodec('copy');
      } else {
        command.videoCodec(videoCOdec);
        // Add video filters only if not using stream copy
        if (resolution !== 'no change') {
          command.videoFilters(`scale=${widthValue}:${heightValue}`);
        }
        if (aspectRatio !== 'no change') {
          command.videoFilters(`setdar=${aspectRatio}`);
        }
        if (aspectRatio !== 'no change') {
          command.videoFilters(`setdar=${aspectRatio}`);
        }

        if (constantQuality === 'no change') {
        } else {
          command.videoCodec('libx264');
          command.addOptions([`-crf ${qualityConstant}`]);
        }
      }
      command.save(outputPath);
    }
  });
});

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
