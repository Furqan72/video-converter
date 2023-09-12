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
          // res.download(outputPath, (err) => {
          //   if (err) {
          //     io.emit('message', 'Download Error: ' + err.message);
          //     console.error('Download Error:', err);
          //   } else {
          //     console.log('Download Complete');
          //     // Deleting Output File
          //     fs.unlink(outputPath, (err) => {
          //       if (err) {
          //         console.error('Error deleting converted file:', err);
          //       } else {
          //         console.log('Converted file deleted.');
          //       }
          //     });
          //     // Deleting Input File
          //     fs.unlink(inputPath, (err) => {
          //       if (err) {
          //         console.error('Error deleting converted file:', err);
          //       } else {
          //         console.log('Original file deleted.');
          //       }
          //     });
          //   }
          // });
        })
        .on('error', (err) => {
          io.emit('message', 'Conversion Error: ' + err.message);
          console.error('Error:', err);
          res.status(500).send('Conversion Error: ' + err.message);
        });

      if (startingTime && endingTime && endingTime !== '00:00:00') {
        command.setStartTime(startingTime);
        command.setDuration(endingTime);
      }

      command.save(outputPath);
    }
  });
});

app.delete('/', (req, res) => {
  const filename = req.params.filename;
  const filePath = `./temp-output/${filename}`; // Adjust the path as needed

  // Use fs.unlink to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      res.status(500).send('Error deleting file');
    } else {
      console.log(`File ${filename} deleted successfully.`);
      res.send(`File ${filename} deleted successfully`);
    }
  });
});

// app.post('/convert', (req, res) => {
//   let inputFile = req.files.videoFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;

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

//   const command = new ffmpeg(inputPath)
//     .on('start', (commandLine) => {
//       console.log('Conversion Started.');
//     })
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
//           console.log('Download Complete');
//           // Deleting Output File
//           fs.unlink(outputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Converted file deleted.');

//               res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues });
//             }
//           });
//           // Deleting Input File
//           fs.unlink(inputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Original file deleted.');
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
//     command.setStartTime(startingTime);
//     command.setDuration(endingTime);
//   }

//   command.save(outputPath);
// });

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
