// app.post('/convert', (req, res) => {
//   let inputFile = req.files.uploadFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;

//   // io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, function (err) {
//     if (err) {
//       // io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       // io.emit('message', 'File Uploaded Successfully.');
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
//         // io.emit('message', 'Conversion Progress: ' + progress.percent.toFixed(2) + '%');
//       }
//     })
//     .on('end', () => {
//       // io.emit('message', 'Conversion Finished.');
//       console.log('Conversion finished.');
//       res.download(outputPath, (err) => {
//         if (err) {
//           // io.emit('message', 'Download Error: ' + err.message);
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
//       // io.emit('message', 'Conversion Error: ' + err.message);
//       console.error('Error:', err);
//     });

//   if (startingTime && endingTime && endingTime !== '00:00:00') {
//     command.setStartTime(startingTime);
//     command.setDuration(endingTime);
//   }

//   command.save(outputPath);
// });

// --------------------------------------------------------------------------------------------------------------------

// app.delete('/', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = `./temp-output/${filename}`; // Adjust the path as needed

//   // Use fs.unlink to delete the file
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error('Error deleting file:', err);
//       res.status(500).send('Error deleting file');
//     } else {
//       console.log(`File ${filename} deleted successfully.`);
//       res.send(`File ${filename} deleted successfully`);
//     }
//   });
// });

// --------------------------------------------------------------------------------------------------------------------

// <!-- <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Resolution</label>
// <select name="ResolutionMenu" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in resolutionOptions" :key="index" :value="option.value">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Aspect&nbsp;Ratio</label>
// <select name="AspectRatioSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in aspectRatioOptions" :key="index" :value="option.value">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Constant&nbsp;Quality (CRF)</label>
// <select name="ConstantQualitySelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in constantQualityOptions" :key="index" :value="option.value" :selected="option.label === '23 (normal quality)'">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Video&nbsp;Codec</label>
// <select name="videotCodecSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in videotCodecOptions" :key="index" :value="option.value" :selected="option.label === 'x264'">{{ option.label }}</option>
// </select>
// </div> -->

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const ffmpeg = require('fluent-ffmpeg');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
// // const fs = require('fs');
// // const { log } = require('console');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['*'],
//   },
// });

// const AllowedDomains = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200,
// };

// app.use(cors(AllowedDomains));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: './temp-files/',
//   })
// );
// app.use('/temp-output', express.static('temp-output'));

// app.get('/video-converter', (req, res) => {
//   res.sendFile(__dirname + '../video-converter/index.html');
// });

// app.post('/convert', (req, res) => {
//   let inputFile = req.files.uploadFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;
//   let resolution = req.body.ResolutionMenu;
//   let [widthValue, heightValue] = resolution.split('x');
//   let videoCOdec = req.body.videotCodecSelect;
//   let aspectRatio = req.body.AspectRatioSelect;
//   let qualityConstant = req.body.ConstantQualitySelect;
//   let presetValue = req.body.presetSelect;
//   let tuning = req.body.tuneSelect;
//   let profileValue = req.body.profileSelect;
//   let levelValue = req.body.levelSelect;
//   let fitValue = req.body.fitSelect;
//   // let fps
//   let imageWatermark = req.files.waterMarkImage;

//   // io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, async function (err) {
//     if (err) {
//       // io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       // io.emit('message', 'File Uploaded Successfully.');

//       const inputPath = `./temp-files/${inputFile.name}`;
//       const lastDotIndex = inputFile.name.lastIndexOf('.');
//       const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
//       const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
//       let errorMessage = '';
//       let watermarkPath = '';

//       if (imageWatermark) {
//         // io.emit('message', 'Saving WaterMark');
//         imageWatermark.mv('temp-files/' + imageWatermark.name, function (err) {
//           console.log('imageWatermark saved');
//           if (err) {
//             // io.emit('message', 'WaterMark Saved Error: ' + err.message);
//             return res.status(500).send(err);
//           } else {
//             // io.emit('message', 'WaterMark Saved Successfully.');
//           }
//         });
//         watermarkPath = `./temp-files/${imageWatermark.name}`;
//       }

//       let originalWidth, originalHeight;
//       const command = new ffmpeg(inputPath);
//       // trimming
//       try {
//         const metadata = await getVideoMetadata(inputPath);
//         console.log(metadata);
//         const totalVideoDurationInSeconds = metadata.format.duration;
//         originalWidth = metadata.streams[0].width;
//         originalHeight = metadata.streams[0].height;
//         console.log('Video Duration: ', totalVideoDurationInSeconds, 'seconds');

//         let startingInSeconds = parseTime(startingTime);
//         let endingInSeconds = parseTime(endingTime);

//         if (startingInSeconds < 0 || endingInSeconds < 0) {
//           errorMessage = 'Start and end times must be non-negative values.';
//         } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
//           errorMessage = 'Invalid start or end time.';
//         } else if (startingTime && endingTime && endingTime !== '00:00:00') {
//           let totalDuration = calculateDuration(startingTime, endingTime);
//           command.setStartTime(startingTime);
//           command.setDuration(totalDuration);
//         }
//       } catch (err) {
//         errorMessage = 'Error retrieving video metadata.';
//       }

//       let complexFilter = '';
//       if (imageWatermark && resolution !== 'no change') {
//         complexFilter = `[0:v]scale=${widthValue}:${heightValue}[scaled];[scaled][1:v]overlay=(W-w)/2:(H-h)/2`;
//       } else if (imageWatermark) {
//         complexFilter = `[0:v]scale=${originalWidth}:${originalHeight}[scaled];[scaled][1:v]overlay=(W-w)/2:(H-h)/2`;
//       } else if (resolution !== 'no change') {
//         complexFilter = `[0:v]scale=${widthValue}:${heightValue}`;
//       }

//       if (videoCOdec === 'copy') {
//         command.videoCodec('copy');
//       } else {
//         // videoCodec without 'copy'
//         command.videoCodec(videoCOdec);
//         // let videoFilters = [];
//         if (complexFilter) {
//           // command.complexFilter([complexFilter]);
//           command.input(watermarkPath); // Add the second input video stream

//           // Update the complex filter to use [1:v] for the second input stream
//           complexFilter = `[0:v]scale=${widthValue}:${heightValue}[scaled];[scaled][1:v]overlay=(W-w)/2:(H-h)/2`;

//           // Set the complex filter in the command
//           command.complexFilter([complexFilter]);
//         }
//         // videoFilters.push(`scale=${resolution}`);
//         // if (aspectRatio !== 'no change') {
//         //   videoFilters.push(`setdar=${aspectRatio}`);
//         // }
//         // if (aspectRatio !== 'no change') {
//         //   videoFilters.push(`setdar=${aspectRatio}`);
//         // }
//         // if (imageWatermark) {
//         //   command.input(watermarkPath).complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2`);
//         // }
//         // if (videoFilters.length > 0) {
//         //   command.videoFilters(`${videoFilters.join(',')}`);
//         // }
//         // tune
//         if (tuning !== 'none') {
//           command.addOptions([`-tune ${tuning}`]);
//         }
//         // profile
//         if (profileValue !== 'none') {
//           command.addOptions([`-profile:v ${profileValue}`]);
//         }
//         // level
//         if (levelValue !== 'none') {
//           command.addOptions([`-level ${levelValue}`]);
//         }
//         // CRF
//         command.addOptions([`-crf ${qualityConstant}`]);
//         // Preset
//         command.addOptions([`-preset ${presetValue}`]);
//       }
//       // covnersion start
//       command.on('start', () => {
//         // io.emit('message', 'Conversion Started.');
//       });
//       // covnersion in progress
//       command.on('progress', (progress) => {
//         if (progress.percent !== undefined) {
//           const progressPercent = progress.percent.toFixed(2);
//           // io.emit('progress', progressPercent);
//         }
//       });
//       // covnersion end
//       command.on('end', () => {
//         progressPercent = 100;
//         // io.emit('progress', progressPercent);
//         // io.emit('message', 'Conversion Finished.');
//       });
//       // covnersion error
//       command.on('error', (err) => {
//         // io.emit('message', 'Conversion Error: ' + err.message);
//         res.status(500).send('Conversion Error: ' + err.message);
//       });

//       res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues, message: errorMessage });
//       if (errorMessage !== '') {
//         return;
//       }
//       // videoCodec with 'copy'   =>  no other filters work with 'copy' as it encodes according to the previous settings of the video

//       command.save(outputPath);
//     }
//   });
// });

// function getVideoMetadata(inputPath) {
//   return new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(inputPath, (err, metadata) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log(metadata);
//         resolve(metadata);
//       }
//     });
//   });
// }

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

// // io.on('connection', (socket) => {
//   console.log('A client connected');
//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

// server.listen(4000, () => {
//   console.log('server running on 4000 port');
// });

// --------------------Most-----Current-----Code------------------------------------------------------------------------------------------------------------------------

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const ffmpeg = require('fluent-ffmpeg');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
// // const fs = require('fs');
// // const { log } = require('console');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['*'],
//   },
// });

// const AllowedDomains = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200,
// };

// app.use(cors(AllowedDomains));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: './temp-files/',
//   })
// );
// app.use('/temp-output', express.static('temp-output'));

// app.get('/video-converter', (req, res) => {
//   res.sendFile(__dirname + '../video-converter/index.html');
// });

// app.post('/convert', (req, res) => {
//   let inputFile = req.files.uploadFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;
//   let resolution = req.body.ResolutionMenu;
//   let [widthValue, heightValue] = resolution.split('x');
//   let videoCOdec = req.body.videotCodecSelect;
//   let aspectRatio = req.body.AspectRatioSelect;
//   let qualityConstant = req.body.ConstantQualitySelect;
//   let presetValue = req.body.presetSelect;
//   let tuning = req.body.tuneSelect;
//   let profileValue = req.body.profileSelect;
//   let levelValue = req.body.levelSelect;
//   let fitValue = req.body.fitSelect;
//   // let fps
//   let imageWatermark = req.files.waterMarkImage;

//   // io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, async function (err) {
//     if (err) {
//       // io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       // io.emit('message', 'File Uploaded Successfully.');

//       const inputPath = `./temp-files/${inputFile.name}`;
//       const lastDotIndex = inputFile.name.lastIndexOf('.');
//       const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
//       const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
//       let errorMessage = '';

//       let originalWidth, originalHeight;
//       const command = new ffmpeg(inputPath);
//       try {
//         const metadata = await getVideoMetadata(inputPath);
//         const totalVideoDurationInSeconds = metadata.format.duration;
//         originalWidth = metadata.streams[0].width;
//         originalHeight = metadata.streams[0].height;
//         console.log('Video Duration: ', totalVideoDurationInSeconds, 'seconds');

//         let startingInSeconds = parseTime(startingTime);
//         let endingInSeconds = parseTime(endingTime);

//         if (startingInSeconds < 0 || endingInSeconds < 0) {
//           errorMessage = 'Start and end times must be non-negative values.';
//         } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
//           errorMessage = 'Invalid start or end time.';
//         } else if (startingTime && endingTime && endingTime !== '00:00:00') {
//           // trimming
//           let totalDuration = calculateDuration(startingTime, endingTime);
//           command.setStartTime(startingTime);
//           command.setDuration(totalDuration);
//         }
//       } catch (err) {
//         errorMessage = 'Error retrieving video metadata.';
//       }

//       if (videoCOdec === 'copy') {
//         command.videoCodec('copy');
//       } else {
//         // videoCodec without 'copy'
//         command.videoCodec(videoCOdec);
//         let videoFilters = [];
//         videoFilters.push(`scale=${widthValue}:${heightValue}`);
//         if (aspectRatio !== 'no change') {
//           videoFilters.push(`setdar=${aspectRatio}`);
//         }
//         if (aspectRatio !== 'no change') {
//           videoFilters.push(`setdar=${aspectRatio}`);
//         }
//         if (videoFilters.length > 0) {
//           command.videoFilters(`${videoFilters.join(',')}`);
//         }
//         // tune
//         if (tuning !== 'none') {
//           command.addOptions([`-tune ${tuning}`]);
//         }
//         // profile
//         if (profileValue !== 'none') {
//           command.addOptions([`-profile:v ${profileValue}`]);
//         }
//         // level
//         if (levelValue !== 'none') {
//           command.addOptions([`-level ${levelValue}`]);
//         }
//         // CRF
//         command.addOptions([`-crf ${qualityConstant}`]);
//         // Preset
//         command.addOptions([`-preset ${presetValue}`]);
//       }
//       // covnersion start
//       command.on('start', () => {
//         // io.emit('message', 'Conversion Started.');
//       });
//       // covnersion in progress
//       command.on('progress', (progress) => {
//         if (progress.percent !== undefined) {
//           const progressPercent = progress.percent.toFixed(2);
//           // io.emit('progress', progressPercent);
//         }
//       });
//       // covnersion end
//       command.on('end', () => {
//         progressPercent = 100;
//         // io.emit('progress', progressPercent);
//         // io.emit('message', 'Conversion Finished.');
//       });
//       // covnersion error
//       command.on('error', (err) => {
//         // io.emit('message', 'Conversion Error: ' + err.message);
//         res.status(500).send('Conversion Error: ' + err.message);
//       });

//       res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues, message: errorMessage });
//       if (errorMessage !== '') {
//         return;
//       }
//       // videoCodec with 'copy'   =>  no other filters work with 'copy' as it encodes according to the previous settings of the video

//       command.save(outputPath);
//     }
//   });
// });

// function getVideoMetadata(inputPath) {
//   return new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(inputPath, (err, metadata) => {
//       if (err) {
//         reject(err);
//       } else {
//         // console.log(metadata);
//         resolve(metadata);
//       }
//     });
//   });
// }

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

// // io.on('connection', (socket) => {
//   console.log('A client connected');
//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

// server.listen(4000, () => {
//   console.log('server running on 4000 port');
// });

// --------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------------------------------------------------------------
// checking for error in the format
command
  .on('start', (commandLine) => {
    console.log('FFmpeg command: ' + commandLine);
    // io.emit('message', 'Conversion Started.');
  })
  .on('stderr', (stderrLine) => {
    commandError += stderrLine + '\n';
  })
  .on('end', () => {
    // io.emit('message', 'Conversion Finished.');
    console.log('FFmpeg command finished.');
    console.log('FFmpeg output:', commandOutput);
    console.log('FFmpeg error:', commandError);
  })
  .on('error', (err, stdout, stderr) => {
    console.error('Error:', err);
    console.error('FFmpeg stderr:', stderr);
    // io.emit('message', 'Conversion Error: ' + err.message);
    res.status(500).send('Conversion Error: ' + err.message);
  })
  .on('progress', (progress) => {
    if (progress.percent !== undefined) {
      const progressPercent = progress.percent.toFixed(2);
      // io.emit('progress', progressPercent);
    }
  })
  .on('codecData', (data) => {
    commandOutput += data + '\n';
  });
//
// +-----------------------------------------------------------------------------------------------------------------------------------------+
//
const OptionsOnRequest = (req) => {
  const selectMenuValues = req.body.selectMenu;
  const resolution = req.body.ResolutionMenu;
  const videoCodec = req.body.videotCodecSelect;
  const aspectRatio = req.body.AspectRatioSelect;
  const qualityConstant = selectMenuValues !== '.wmv' ? req.body.ConstantQualitySelect : '';
  const presetValue = selectMenuValues === '.avi' || selectMenuValues === '.flv' || selectMenuValues === '.mkv' || selectMenuValues === '.mov' || selectMenuValues === '.mp4' ? req.body.presetSelect : '';
  const tuning = selectMenuValues === '.avi' || selectMenuValues === '.flv' || selectMenuValues === '.mkv' || selectMenuValues === '.mov' || selectMenuValues === '.mp4' ? req.body.tuneSelect : '';
  const profileValue = selectMenuValues === '.avi' || selectMenuValues === '.flv' || selectMenuValues === '.mkv' || selectMenuValues === '.mov' || selectMenuValues === '.mp4' ? req.body.profileSelect : '';
  const levelValue = selectMenuValues === '.avi' || selectMenuValues === '.flv' || selectMenuValues === '.mkv' || selectMenuValues === '.mov' || selectMenuValues === '.mp4' ? req.body.levelSelect : '';
  const fitValue = req.body.fitSelect;
  const framePersecond = req.body.Fps;
  const AudioCodecSelect = req.body.AudioCodec;
  const Channels = req.body.ChannelsSelect;
  const videoVolume = req.body.VolumeSelect;
  const SampleRate = req.body.SampleRateSelect;
  const AudioBitrateValue = req.body.AudioBitrate;
  const desiredKeyframeInterval = req.body.KeyframeInterval;
  const subtitlesType = req.body.subtitleType;
  const QscaleValue = selectMenuValues === '.wmv' ? req.body.Qscale : '';

  const options = {
    selectMenuValues,
    resolution,
    videoCodec,
    aspectRatio,
    qualityConstant,
    presetValue,
    tuning,
    profileValue,
    levelValue,
    fitValue,
    framePersecond,
    AudioCodecSelect,
    Channels,
    videoVolume,
    SampleRate,
    AudioBitrateValue,
    desiredKeyframeInterval,
    subtitlesType,
    QscaleValue,
  };

  return options;
};
//
// +-----------------------------------------------------------------------------------------------------------------------------------------+
//

// const extractOptionsFromRequest = (req, propertyNames) => {
//   const options = {};

//   for (const propName of propertyNames) {
//     options[propName] = req[propName];
//   }

//   return options;
// };

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// const express = require('express');
// const http = require('http');
// // const socketIo = require('socket.io');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
// // const ffmpeg = require('fluent-ffmpeg');
// const sharp = require('sharp');
// const fs = require('fs');

// // routes
// const router = require('./router');
// // Global Functions
// const globalFunctions = require('./global/globalFunctions');
// // functions
// const imageConverter = require('./functions/imageConverter');
// const imageConverterTest = require('./functions/imageConverterTest');

// const app = express();
// const server = http.createServer(app);

// const AllowedDomains = {
//   origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
//   optionsSuccessStatus: 200,
// };

// console.log('Working!!');

// app.use(cors(AllowedDomains));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/temp-files/',
//   })
// );

// app.use('/', router);

// app.use(
//   '/temp-output',
//   (req, res, next) => {
//     const fileName = `${globalFunctions.fileName}`;
//     const disposition = `attachment; filename="${fileName}"`;
//     res.setHeader('Content-Disposition', disposition);

//     next();
//   },
//   express.static('temp-output')
// );

// app.post('/test', async (req, res) => {
//   const filePathInput = 'temp-files/giffy.gif';
//   const filePathOutput = 'temp-output/converted-giffy.png';

//   try {
//     await sharp(filePathInput).toFormat('png').toFile(filePathOutput);
//     const imageName = 'converted-giffy.png';

//     res.json({ downloadUrl: filePathOutput, fileName: imageName });
//     console.log('Conversion Complete!!');
//   } catch (error) {
//     console.error('Error converting file:', error);
//     res.status(500).send('Error converting file: ', error);
//   }
// });

// // checking for file
// app.get('/processed', async (req, res) => {
//   const fileNameToCheck = 'converted-giffy.png';
//   const filePath = `./temp-output/${fileNameToCheck}`;

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error(`File ${fileNameToCheck} does not exist`);
//       res.status(404).send(`File ${fileNameToCheck} does not exist`);
//       return;
//     }

//     console.log(`File ${fileNameToCheck} exists`);
//     res.status(200).send(`File ${fileNameToCheck} exists`);
//   });
// });

// // server
// app.listen(8080, () => {
//   console.log('server running on 8080 port');
// });

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// // const socketIo = require('socket.io');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const sharp = require('sharp');
// const multer = require('multer');
// const { put } = require('@vercel/blob');
// const { del } = require('@vercel/blob');
// // routes
// const router = require('./router');

// // const AllowedDomains = {
// //   origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type'],
// //   optionsSuccessStatus: 200,
// // };

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server: server, path: '/ws' });
// // const io = socketIo(server, {
// //   cors: {
// //     origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
// //     methods: ['*'],
// //   },
// // });

// const AllowedDomains = {
//   origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(AllowedDomains));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

// const upload = multer().single('uploadFile');
// app.use(upload);

// // default
// app.get('/', (req, res) => {
//   res.status(200).send('Default');
// });

// app.options('/test', cors(AllowedDomains), (req, res) => {
//   res.sendStatus(200);
// });

// // websocket connection
// let connectedClient = null;
// wss.on('connection', (client) => {
//   connectedClient = client;

//   client.on('close', () => {
//     connectedClient = null;
//   });
// });

// app.post('/test', async (req, res) => {
//   try {
//     const fileUrl = await uploadToVercelBlob(req);
//     const downloadUrl = fileUrl.url;

//     console.log('Done Uploading...');

//     const options = {
//       inputFile: req.file,
//       selectMenuValues: req.body.selectMenu,
//       fileWidth: req.body.width,
//       fileHeight: req.body.height,
//       fitValue: req.body.fit,
//       stripValue: req.body.strip,
//       orientValue: req.body.orient,
//       qualityValue: req.body.quality,
//     };
//     const filename = options.inputFile.originalname;

//     const imageResponse = await fetch(downloadUrl);
//     // console.log(imageResponse);
//     if (!imageResponse.ok) {
//       throw new Error(`Image download failed with status ${imageResponse.status}`);
//     }

//     const imageBuffer = await imageResponse.arrayBuffer();
//     const imageMetadata = await sharp(imageBuffer).metadata();

//     const formatWithoutLeadingDot = options.selectMenuValues.slice(1);

//     // Convert using sharp
//     // const sharpCommand = await sharp(imageBuffer).toFormat(formatWithoutLeadingDot).toBuffer();
//     const sharpCommand = sharp(imageBuffer);

//     if (options.fileWidth && options.fileHeight) {
//       sharpCommand.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue });
//     }
//     if (options.stripValue === 'yes') {
//       sharpCommand.withMetadata(false);
//     }
//     if (options.orientValue === 'yes') {
//       sharpCommand.rotate();
//     }
//     if (options.inputFile.originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
//       sharpCommand.toFormat('gif');
//     }
//     if (imageMetadata.hasAlpha) {
//       sharpCommand.toFormat('png');
//     }

//     sharpCommand.toBuffer();

//     console.log('Done Editing...');

//     // Upload the converted-image to Vercel Blob
//     const webpUrl = await put(`${downloadUrl.split('.')[0]}${options.selectMenuValues}`, sharpCommand, { access: 'public', contentType: `image/${formatWithoutLeadingDot}`, token: blobReadWriteToken });
//     console.log('Done Re-Uploading...');

//     res.json({ downloadUrl: webpUrl.url, filedeleted: deletedFile, metadata: imageMetadata });
//     console.log('Done Sending Response...');

//     del(fileUrl.url, { token: blobReadWriteToken })
//       .then(() => {
//         console.log('Blob deleted');
//       })
//       .catch((error) => {
//         console.error('Error deleting blob', error);
//       });

//     const deletedFile = fileUrl.url;
//     // const deletedFile = '';
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error.message);
//   }
// });

// // uploading file
// const uploadToVercelBlob = async (req) => {
//   const inputFile = await req.file;
//   console.log(inputFile.buffer);

//   const uploadUrl = await put(inputFile.originalname, inputFile.buffer, { access: 'public', contentType: `image/${req.body.selectMenu}`, token: blobReadWriteToken });
//   return uploadUrl;
// };

// // io.on('connection', (socket) => {
// //   console.log('A client connected');

// //   socket.on('startConversion', () => {
// //     console.log('A client has started Conversion.');
// //   });

// //   socket.on('disconnect', () => {
// //     console.log('A client disconnected');
// //   });
// // });

// // server
// server.listen(8080, () => {
//   console.log(`Server is running on 8080 port`);
// });

//  ^
// +-----------------------------------------------------------------------------------------------------------------------------------------+
let subtitleResponse, watermarkResponse;
// subtitle/(.SRT .ART)
// const [subtitleUrl] = editingoptions.subtitleFiles ? await Promise.all([uploadToVercelBlob(req.files.subtitleFile)]) : '';
if (subtitleUrl) {
  console.log('Done Uploading Subtitles... ' + subtitleUrl.url);
  const subtitleDownloadUrl = subtitleUrl.url;
  subtitleResponse = await fetch(subtitleDownloadUrl);
  console.log('Done Downloading...');
}

// watermark/image
// const [watermarkUrl] = editingoptions.imageWatermark ? await Promise.all([uploadToVercelBlob(req.files.waterMarkImage)]) : '';
if (watermarkUrl) {
  console.log('Done Uploading Watermark... ' + watermarkUrl.url);
  const watermarkDownloadUrl = watermarkUrl.url;
  watermarkResponse = await fetch(watermarkDownloadUrl);
  console.log('Done Downloading...');
}

// if (subtitleUrl) {
//   await del(subtitleUrl.url, { token: blobReadWriteToken });
// }
// if (watermarkUrl) {
//   await del(watermarkUrl.url, { token: blobReadWriteToken });
// }
// -----------------------------+++++++++                                      +++++++++++++++++++____________________________________
// if (editingoptions.startingTime && editingoptions.endingTime) {
//   command.setStartTime(editingoptions.startingTime);
//   command.setDuration(editingoptions.endingTime - editingoptions.startingTime);
// }

//
//
//

// const processedVideoUrl = await put(`${downloadUrl.split('.')[0]}${req.body.selectMenuValues}`, command.output, {
//   access: 'public',
//   contentType: `video/${formatWithoutLeadingDot}`,
//   token: blobReadWriteToken,
// });

// most recent ^
// +-----------------------------------------------------------------------------------------------------------------------------------------+

// Video Configuration
const configureVideoConversion = (command, options, originalDimensions) => {
  console.log(`Video resolution ORGINAL DIMENSIONS : ${originalDimensions.width}x${originalDimensions.height}`);

  let filtersForVideo = [];
  let [width, height] = options.resolution.split('x');

  // copy-codec
  if (options.videoCOdec === 'copy') {
    command.videoCodec(options.videoCOdec);

    // videoCodec without 'copy' . using codec other than copy
  } else {
    command.videoCodec(options.videoCOdec);

    // resolution is 'no change'
    if (options.resolution === 'no change') {
      filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, originalDimensions.width, originalDimensions.height, options.aspectRatio));
      console.log(`Video resolution ORGINAL DIMENSIONS (condition working ==='no change') : ${originalDimensions.width}x${originalDimensions.height}`);

      // any reolution other than  'no change'
    } else if (options.resolution !== 'no change') {
      filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, width, height, options.aspectRatio)); // pre-defined values are all even-numbers
    }

    if (filtersForVideo[0] && filtersForVideo[0].length > 0) {
      const complexFilterExpression = filtersForVideo[0].join(';');
      command.complexFilter(complexFilterExpression);
    }

    const asyncOptionsFunctions = [
      async () => {
        if (options.qualityConstant) {
          command.addOptions([`-crf ${options.qualityConstant}`]);
        }
      },
      async () => {
        if (options.tuning && options.tuning !== 'none') {
          command.addOptions([`-tune ${options.tuning}`]);
        }
      },
      async () => {
        if (options.profileValue && options.profileValue !== 'none') {
          command.addOption(`-profile:v ${options.profileValue}`);
        }
      },
      async () => {
        if (options.levelValue && options.levelValue !== 'none') {
          command.addOptions([`-level ${options.levelValue}`]);
        }
      },
      async () => {
        if (options.presetValue) {
          command.addOptions([`-preset ${options.presetValue}`]);
        }
      },
      async () => {
        if (options.QscaleValue && options.selectMenuValues === '.wmv') {
          command.addOption(`-q:v ${options.QscaleValue}`);
        }
      },
      async () => {
        if (options.framePersecond) {
          command.addOption('-r', options.framePersecond);
        }
      },
      async () => {
        if (options.desiredKeyframeInterval) {
          command.addOption(`-g ${options.desiredKeyframeInterval}`);
        }
      },
      async () => {
        if (originalDimensions.buffer_size && originalDimensions.max_bitrate) {
          command.addOptions([`-bufsize ${originalDimensions.buffer_size}`]);
          command.addOptions([`-maxrate ${originalDimensions.max_bitrate}`]);
        }
      },
    ];

    Promise.all(asyncOptionsFunctions.map((asyncFn) => asyncFn()));
  }
};

// Audio Configuration
const configureAudioConversion = (command, options) => {
  // audio filter chain
  let audioFilterValues = '';
  if (options.AudioCodecSelect !== 'copy' && options.AudioCodecSelect !== 'none') {
    if (options.videoVolume !== '') {
      audioFilterValues += `volume=${options.videoVolume},`;
    }
    if (options.SampleRate !== '') {
      audioFilterValues += `asetrate=${options.SampleRate},`;
    }
    if (options.audioFilterValues !== '') {
      audioFilterValues = audioFilterValues.slice(0, -1);
    }
  }

  // Audio Settings
  if (options.AudioCodecSelect === 'none') {
    command.addOption('-an');
  } else if (options.AudioCodecSelect === 'copy') {
    command.audioCodec(options.AudioCodecSelect);
  } else if (options.AudioCodecSelect !== '') {
    // Audio Codec
    command.audioCodec(options.AudioCodecSelect);
    // audio Bitrate
    if (options.AudioBitrateValue !== '') {
      command.audioBitrate(`${options.AudioBitrateValue}`);
    }

    // audio channels
    if (options.Channels !== '') {
      command.audioChannels(`${options.Channels}`);
    }
    if (audioFilterValues.length > 0) {
      command.audioFilter(`${audioFilterValues}`);
    }
  }
};

// Trimming
const configureMetadataTrimming = async (command, options, path) => {
  let [errorMessages, checkSubtitles, videoStream, completeData] = ['', false, '', ''];

  try {
    const metadata = await functions.getVideoMetadata(path);
    const totalVideoDurationInSeconds = metadata.format.duration;
    console.log('Video Duration: ', totalVideoDurationInSeconds, 'seconds');
    checkSubtitles = metadata.streams.some((stream) => stream.codec_type === 'subtitle');
    videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
    completeData = metadata; // all metadata

    let startingInSeconds = functions.parseTime(options.startingTime);
    let endingInSeconds = functions.parseTime(options.endingTime);

    if (startingInSeconds < 0 || endingInSeconds < 0) {
      errorMessages = 'Start and end times must be non-negative values.';
    } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
      errorMessages = 'Invalid start or end time. The duration of this video is ' + totalVideoDurationInSeconds + ' seconds.';

      // trimming
    } else if (options.startingTime && options.endingTime && options.endingTime !== '00:00:00') {
      let formattedDuration = functions.formatTime(totalVideoDurationInSeconds);
      console.log('formattedDuration------>>> ', formattedDuration);
      let totalDuration = functions.calculateDuration(options.startingTime, options.endingTime);

      console.log('Starting Time (in sec): >>>>>>>>>>>>>>>>>>>  ' + startingInSeconds);
      console.log('Ending Time (in sec): >>>>>>>>>>>>>>>>>>>  ' + endingInSeconds);
      console.log('Total Time (Duration): >>>>>>>>>>>>>>>>>>>  ' + totalDuration);

      command.setStartTime(options.startingTime || `00:00:00`);
      command.setDuration(totalDuration || formattedDuration);
    }
  } catch (err) {
    console.log('not working');
    errorMessages = 'Error retrieving video metadata. Please try again or upload another file.';
  }

  return { errorMessages, checkSubtitles, videoStream, completeData };
};

// WaterMark
const configurewaterMark = (command, options, path) => {
  if (options.imageWatermark) {
    console.log(`checking for the path of watermark image -->> ${path}`);
    console.log('Image Watermark Path:', path);
    if (options.resolution === 'no change') {
      console.log('Applying Watermark without Scaling');
      command.complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2`);
    } else {
      console.log('Scaling Watermark and Overlaying');
      command.complexFilter(`[1:v]scale=150:150 [watermark];[0:v][watermark]overlay=(W-w)/2:(H-h)/2`);
    }
    command.input(path);
  }
};

// Subtitles
const configureSubtitles = (command, options, path, checkSubtitles) => {
  if (options.subtitlesType !== 'none' && options.subtitleFiles) {
    console.log(checkSubtitles);
    if (!checkSubtitles) {
      command.input(path);
      command.complexFilter(`[0:v]subtitles=${path}:force_style='Fontsize=20'[noPriorSubtitles]`);
      command.map('[noPriorSubtitles]');
    } else {
      console.log('Embedded subtitles exist');
      if (options.subtitlesType === 'soft') {
        command.complexFilter('[0:v][0:s]overlay[soft_v]');
        command.map('[soft_v]');
      } else if (options.subtitlesType === 'hard') {
        command.complexFilter(`[0:v][0:s]subtitles=${path}:force_style='Fontsize=20'[hard_v]`);
        command.map('[hard_v]');
      } else if (options.subtitlesType === 'copy') {
        command.addOption('-map', '0:s');
      }
    }
  }
};

// +-----------------------------------------------------------------------------------------------------------------------------------------+
//
