const express = require('express');
const fileUpload = require('express-fileupload');
const ffmpeg = require('fluent-ffmpeg');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../video-converter/index.html');
});

app.post('/convert', (req, res) => {
  let inputFile = req.files.videoFile;
  let selectMenuValues = req.body.selectMenu;
  let startingTime = req.body.StartingTime;
  let endingTime = req.body.EndingTime;

  // Emit a message to the web page
  io.emit('message', 'File Upload Started');

  inputFile.mv('temp-files/' + inputFile.name, function (err) {
    if (err) {
      io.emit('message', 'File Upload Error: ' + err.message);
      return res.status(500).send(err);
    } else {
      io.emit('message', 'File Uploaded Successfully.');
    }
  });

  const inputPath = `./temp-files/${inputFile.name}`;
  const lastDotIndex = inputFile.name.lastIndexOf('.');
  const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
  const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;

  const command = new ffmpeg(inputPath)
    .on('end', () => {
      io.emit('message', 'Conversion Finished.');
      console.log('Conversion finished.');
    })
    .on('error', (err) => {
      io.emit('message', 'Conversion Error: ' + err.message);
      console.error('Error:', err);
    });

  if (startingTime && endingTime && endingTime !== '00:00:00') {
    command.setStartTime(startingTime);
    command.setDuration(endingTime);
  }

  command.save(outputPath);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
