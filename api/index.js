// const express = require('express');
// const fileUpload = require('express-fileupload');
// const ffmpeg = require('fluent-ffmpeg');
// const bodyParser = require('body-parser');
// const http = require('http');
// const socketIo = require('socket.io');
// const fs = require('fs');
// const { parse } = require('path');
// // const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: './temp-files/',
//   })
// );

// app.get('/video-converter', (req, res) => {
//   res.sendFile(__dirname + '../video-converter/src/components/Home.vue');
// });

// app.post('/convert', (req, res) => {
//   console.log(req.body);
//   let inputFile = req.files.videoFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;
//   let loading = req.body.loading;
//   let endingInSeconds = parseTime(endingTime);

//   io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, function (err) {
//     if (err) {
//       io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       io.emit('message', 'File Uploaded Successfully.');
//     }
//   });

//   const inputPath = `./temp-files/${inputFile.name}`;
//   const lastDotIndex = inputFile.name.lastIndexOf('.');
//   const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
//   const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
//   let durationInSeconds = 0;

//   ffmpeg.ffprobe(inputPath, (err, metadata) => {
//     if (err) {
//       console.error('Error:', err);
//     } else {
//       console.log(metadata);
//       durationInSeconds = metadata.format.duration;
//       console.log('Video Duration:', durationInSeconds, 'seconds');

//       if (durationInSeconds <= endingInSeconds) {
//         console.log('Ending Time is more than the duration of the video.');
//         return res.status(400).send('Ending Time is more than the duration of the video.');
//       }
//     }
//   });

//   const command = new ffmpeg(inputPath)
//     .on('start', (commandLine) => {
//       console.log('Conversion process started with command:', commandLine);
//     })
//     // .on('progress', (progress) => {
//     //   console.log('Conversion progress:', progress.percent.toFixed(2) + '%');
//     //   io.emit('message', 'Conversion Progress: ' + progress.percent.toFixed(2) + '%');
//     // })
//     .on('progress', (progress) => {
//       if (progress.percent !== undefined) {
//         console.log('Conversion progress:', progress.percent.toFixed(2) + '%');
//         io.emit('message', 'Conversion Progress: ' + progress.percent.toFixed(2) + '%');
//       }
//     })

//     .on('end', () => {
//       io.emit('message', 'Conversion Finished.');
//       console.log('Conversion finished.');

//       res.download(outputPath, (err) => {
//         if (err) {
//           io.emit('message', 'Download Error: ' + err.message);
//           console.error('Download Error:', err);
//         } else {
//           // Delete the temporary output file after download
//           fs.unlink(outputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Converted file deleted.');
//             }
//           });
//           fs.unlink(inputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Converted file deleted.');
//             }
//           });
//         }
//       });
//     })
//     .on('error', (err) => {
//       io.emit('message', 'Conversion Error: ' + err.message);
//       console.error('Error:', err);
//     });

//   if (startingTime && endingTime && endingTime !== '00:00:00') {
//     let totalDuration = calculateDuration(startingTime, endingTime);
//     command.setStartTime(startingTime);
//     command.setDuration(totalDuration);
//   }

//   command.save(outputPath);
// });

// function parseTime(time) {
//   const [hours, minutes, seconds] = time.split(':').map(Number);
//   return hours * 3600 + minutes * 60 + seconds;
// }

// function calculateDuration(startTime, endTime) {
//   const start = parseTime(startTime);
//   const end = parseTime(endTime);
//   const durationInSeconds = end - start;
//   return formatTime(durationInSeconds);
// }

// function formatTime(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;
//   return `${hours}:${minutes}:${remainingSeconds}`;
// }

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// server.listen(4000, () => {
//   console.log('server running on 4000 port');
// });
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

app.get('/video-converter', (req, res) => {
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
    .on('start', (commandLine) => {
      console.log('Conversion process started with command:', commandLine);
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

      res.download(outputPath, (err) => {
        if (err) {
          io.emit('message', 'Download Error: ' + err.message);
          console.error('Download Error:', err);
        } else {
          // Delete the temporary output file after download
          fs.unlink(outputPath, (err) => {
            if (err) {
              console.error('Error deleting converted file:', err);
            } else {
              console.log('Converted file deleted.');
            }
          });
          fs.unlink(inputPath, (err) => {
            if (err) {
              console.error('Error deleting converted file:', err);
            } else {
              console.log('Original file deleted.');
            }
          });
        }
      });
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

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
