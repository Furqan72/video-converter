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
// most recent>>

// const fluentFfmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpegStatic = require('ffmpeg-static');
// const ffprobeStatic = require('ffprobe-static').path;
// const { put, del } = require('@vercel/blob');
// const fetch = require('node-fetch');
// const { PassThrough } = require('stream');

// fluentFfmpeg.setFfmpegPath(ffmpegStatic);
// fluentFfmpeg.setFfprobePath(ffprobeStatic);
// // console.log(ffmpegPath.path, ffmpegPath.version);

// // vercel token
// const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

// const handleError = (message, error) => {
//   console.error(message, error || '');
// };

// // Extracting Options From Request
// const extractOptionsFromRequest = (req) => {
//   const selectedvaluesincluded = ['.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.m4v', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm'];
//   // values when not to include
//   const notincludevalues = selectedvaluesincluded.some((format) => req.body.selectMenu.includes(format));

//   const options = {
//     inputFile: req.files.uploadFile,
//     subtitleFiles: req.files.subtitleFile,
//     imageWatermark: req.files.waterMarkImage,
//     selectMenuValues: req.body.selectMenu,
//     selectForFile: req.body.ConvertFromSelect,
//     startingTime: req.body.StartingTime,
//     endingTime: req.body.EndingTime,
//     resolution: req.body.ResolutionMenu,
//     videoCOdec: req.body.videotCodecSelect,
//     aspectRatio: req.body.AspectRatioSelect,
//     qualityConstant: notincludevalues ? '' : req.body.ConstantQualitySelect,
//     presetValue: notincludevalues ? '' : req.body.presetSelect,
//     tuning: notincludevalues ? '' : req.body.tuneSelect,
//     profileValue: notincludevalues ? '' : req.body.profileSelect,
//     levelValue: notincludevalues ? '' : req.body.levelSelect,
//     fitValue: req.body.fitSelect,
//     framePersecond: req.body.fpsSelect,
//     AudioCodecSelect: req.body.AudioCodec,
//     Channels: req.body.ChannelsSelect,
//     videoVolume: req.body.VolumeSelect,
//     SampleRate: req.body.SampleRateSelect,
//     AudioBitrateValue: req.body.BitrateValuesSelect,
//     desiredKeyframeInterval: req.body.KeyframeInterval,
//     subtitlesType: req.body.subtitleType,
//     QscaleValue: req.body.selectMenu === '.wmv' ? req.body.Qscale : '',
//   };
//   // console.log(options);
//   return options;
// };

// // uploading to vercel blob
// const uploadToVercelBlob = async (file) => {
//   try {
//     return await put(file[0].originalname, file[0].buffer, {
//       access: 'public',
//       contentType: file[0].mimetype,
//       token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Metadata of the video
// function getVideoMetadata(inputPath) {
//   return new Promise((resolve, reject) => {
//     fluentFfmpeg.ffprobe(inputPath, (err, metadata) => {
//       if (err) {
//         console.log('error in metadata');
//         reject(err);
//       } else {
//         // console.log(metadata);
//         resolve(metadata);
//       }
//     });
//   });
// }

// // video conversion function
// const videoConversionFunction = async (req, res) => {
//   try {
//     console.log('Process Start....');
//     const editingoptions = extractOptionsFromRequest(req);
//     const withoutDotSelectMenu = editingoptions.selectMenuValues.slice(1);
//     const withoutDotFileName = editingoptions.inputFile[0].originalname.split('.');
//     console.log(withoutDotFileName[0]);

//     const videoUrl = await uploadToVercelBlob(req.files.uploadFile);
//     console.log('Done Uploading... ' + videoUrl.url);
//     const downloadUrl = videoUrl.url;

//     const videoResponse = await fetch(downloadUrl);
//     console.log('Done Downloading...');
//     // console.log(videoResponse);

//     const videoMetadata = await getVideoMetadata(downloadUrl);
//     console.log('Donetting Metadata.. ');
//     // console.log(videoMetadata);

//     const videoStream = await videoResponse.body;
//     // const videoStreaming = await Buffer.videoResponse;

//     // console.log(videoStreaming);
//     // console.log('------------------------------- ' + videoStreaming);

//     const outputStream = new PassThrough();

//     const command = fluentFfmpeg();
//     command.input(videoStream);
//     command.format(withoutDotSelectMenu);

//     // if (options.framePersecond) {
//     // command.addOption('-r', editingoptions.framePersecond);
//     // }

//     // command.frames(editingoptions.framePersecond);
//     // command.setStartTime(videoMetadata.format.start_time);
//     // command.duration(videoMetadata.format.duration);
//     // command.videoBitrate(videoMetadata.format.bit_rate);

//     // Video Configuration
//     command.videoCodec(editingoptions.videoCOdec);

//     // Audio Configuration
//     command.audioCodec(editingoptions.AudioCodecSelect);

//     // audio filter chain
//     let audioFilterValues = '';
//     if (editingoptions.videoVolume !== '') {
//       audioFilterValues += `volume=${editingoptions.videoVolume},`;
//     }
//     if (editingoptions.SampleRate !== '') {
//       audioFilterValues += `asetrate=${editingoptions.SampleRate},`;
//     }
//     if (editingoptions.audioFilterValues !== '') {
//       audioFilterValues = audioFilterValues.slice(0, -1);
//     }

//     // audio Bitrate
//     if (editingoptions.AudioBitrateValue !== '') {
//       command.audioBitrate(`${editingoptions.AudioBitrateValue}`);
//     }

//     // audio channels
//     if (editingoptions.Channels !== '') {
//       command.audioChannels(`${editingoptions.Channels}`);
//     }
//     if (audioFilterValues.length > 0) {
//       command.audioFilter(`${audioFilterValues}`);
//     }

//     command.pipe(outputStream);
//     console.log('Done Conversion...');

//     // async function uploadConvertedVideo(outputStream) {
//     const videoData = await outputStream.readableStream();
//     // const processedVideo = await put('converted-video.avi', videoData, {
//     // access: 'public',
//     // contentType: 'video/avi',
//     // token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
//     // });
//     // return processedVideo;
//     // }
//     console.log('videoData -------------------------- ');
//     console.log(videoData);

//     const processedVideo = await put('converted-video.avi', videoData, {
//       access: 'public',
//       contentType: 'video/avi',
//       token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
//     });

//     console.log('Done Re-Uploading...' + processedVideo.url);

//     res.json({ downloadUrl: processedVideo.url, filedeleted: 'downloadUrl', metadata: videoMetadata, errorMessage: '' });

//     console.log(' Done Deleting Input File... ' + ' videoUrl.url ');
//   } catch (error) {
//     handleError('Error in videoConversionFunction:', error);

//     res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
//   }
// };

// most recent ^^

// +-----------------------------------------------------------------------------------------------------------------------------------------+

//   console.log('Process Start..........');
//   const options = extractOptionsFromRequest(req);
//   console.log(options);

//   const inputFile = req.files.uploadFile;

//   // Download the input file
//   const inputFileRef = ref(storage, `input-files/${inputFile.name}`);
//   await uploadBytes(inputFileRef, inputFile.data);

//   const inputDownloadUrl = await getDownloadURL(inputFileRef);
//   console.log('Uploaded Input File >> ' + inputDownloadUrl);

//   // Construct output file name
//   const newName = inputFile.name.split('.');
//   const outputName = newName[0];
//   const outputFileName = `converted-${outputName}${options.selectMenuValues}`;
//   const outputPath = `./temp-output/${outputFileName}`;
//   const outputStoragePath = `output-files/${outputFileName}`;

//   // Convert the file
//   const command = new fluentFfmpeg();
//   command.input(inputDownloadUrl);
//   command.videoCodec(options.videoCOdec);
//   command.audioCodec(options.audioCodecSelect);
//   command.save(outputPath);

//   // Wait for the conversion to finish
//   await new Promise((resolve, reject) => {
//     command.on('end', resolve).on('error', reject);
//   });

//   console.log('Conversion completed >> ' + outputPath);

//

// +-----------------------------------------------------------------------------------------------------------------------------------------+
// +--------------------------------------------( Most Updated COde From indexedDB.js )--------------------------------------- +

// // Extracting Options From Request
// const notincludevalues = '';
// function extractOptionsFromRequest(req) {
//   const options = {
//     inputFile: req.files.uploadFile,
//     subtitleFiles: req.files.subtitleFile,
//     imageWatermark: req.files.waterMarkImage,
//     selectMenuValues: req.body.selectMenu,
//     selectForFile: req.body.ConvertFromSelect,
//     startingTime: req.body.StartingTime,
//     endingTime: req.body.EndingTime,
//     resolution: req.body.ResolutionMenu,
//     videoCOdec: req.body.videotCodecSelect,
//     aspectRatio: req.body.AspectRatioSelect,
//     qualityConstant: notincludevalues ? '' : req.body.ConstantQualitySelect,
//     presetValue: notincludevalues ? '' : req.body.presetSelect,
//     tuning: notincludevalues ? '' : req.body.tuneSelect,
//     profileValue: notincludevalues ? '' : req.body.profileSelect,
//     levelValue: notincludevalues ? '' : req.body.levelSelect,
//     fitValue: req.body.fitSelect,
//     framePersecond: req.body.fpsSelect,
//     audioCodecSelect: req.body.AudioCodec,
//     audioChannels: req.body.ChannelsSelect,
//     videoVolume: req.body.VolumeSelect,
//     SampleRate: req.body.SampleRateSelect,
//     AudioBitrateValue: req.body.BitrateValuesSelect,
//     desiredKeyframeInterval: req.body.KeyframeInterval,
//     subtitlesType: req.body.subtitleType,
//     QscaleValue: req.body.selectMenu === '.wmv' ? req.body.Qscale : '',
//   };
//   // console.log(options);

//   return options;
// }
// // file upload
// async function uploadToVercelBlob(file) {
//   try {
//     return await put(file[0].originalname, file[0].buffer, {
//       access: 'public',
//       contentType: file[0].mimetype,
//       token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }
// // file download
// async function downloadVideo(url) {
//   const response = await fetch(url);
//   const videoStream = await response.body;
//   return videoStream;
// }

// // test for video-converter
// app.post('/convert', async (req, res) => {
//   try {
//     console.log('Process Start.....');
//     const options = extractOptionsFromRequest(req);
//     // console.log(options);

//     const videoUrl = await uploadToVercelBlob(options.inputFile);
//     console.log('Uploaded Input File >> ' + videoUrl.url);

//     // const videoStream = await downloadVideo(videoUrl.url);
//     console.log('downloaded.....');

//     const fileName = options.inputFile[0].originalname.split('.');
//     const fileNameIwthoutExtension = fileName[0];
//     console.log(fileNameIwthoutExtension);
//     const tmpOutputPath = `/tmp/converted-${fileNameIwthoutExtension}${options.selectMenuValues}`;
//     // let covnertedFile = options.selectMenuValues.tirm();
//     const selectedValues = options.selectMenuValues.slice(1);
//     console.log(selectedValues);

//     const command = fluentFfmpeg();
//     command.input(videoUrl.url);
//     command.outputOptions(['-c:v libx264']);
//     command.save(tmpOutputPath);

//     command.on('end', async () => {
//       try {
//         const convertedData = await fs.readFileSync(tmpOutputPath);

//         // Upload converted file to Vercel Blob
//         const convertedBlob = await put(`converted/${fileNameIwthoutExtension}${options.selectMenuValues}`, convertedData, {
//           access: 'public',
//           contentType: `video/${selectedValues}`,
//           token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
//         });

//         // covnertedFile = convertedBlob.url;
//         console.log(convertedBlob.url);
//         res.json({ downloadUrl: convertedBlob.url, filedeleted: videoUrl.url, metadata: 'jsonData', errorMessage: '' });
//       } catch (error) {
//         console.error(error);
//         res.json({ downloadUrl: 'covnertedFile', filedeleted: 'videoUrl.url', metadata: 'jsonData', errorMessage: '' });
//       } finally {
//         fs.unlinkSync(tmpOutputPath);
//       }
//     });

//     console.log('process end');
//   } catch (error) {
//     console.log(error);
//     res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
//   }
// });

// const express = require('express');
// const router = express.Router();

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// file upload
async function uploadToVercelBlob(file) {
  try {
    return await put(file[0].originalname, file[0].buffer, {
      access: 'public',
      contentType: file[0].mimetype,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(error);
  }
}

// Extracting Options From Request
function extractOptionsFromRequest(req) {
  const selectedvaluesincluded = ['.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.m4v', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm'];
  // values when not to include
  const notincludevalues = selectedvaluesincluded.some((format) => req.body.selectMenu.includes(format));

  const options = {
    inputFile: req.files.uploadFile,
    subtitleFiles: req.files.subtitleFile,
    imageWatermark: req.files.waterMarkImage,
    selectMenuValues: req.body.selectMenu,
    selectForFile: req.body.ConvertFromSelect,
    startingTime: req.body.StartingTime,
    endingTime: req.body.EndingTime,
    resolution: req.body.ResolutionMenu,
    videoCOdec: req.body.videotCodecSelect,
    aspectRatio: req.body.AspectRatioSelect,
    qualityConstant: notincludevalues ? '' : req.body.ConstantQualitySelect,
    presetValue: notincludevalues ? '' : req.body.presetSelect,
    tuning: notincludevalues ? '' : req.body.tuneSelect,
    profileValue: notincludevalues ? '' : req.body.profileSelect,
    levelValue: notincludevalues ? '' : req.body.levelSelect,
    fitValue: req.body.fitSelect,
    framePersecond: req.body.fpsSelect,
    audioCodecSelect: req.body.AudioCodec,
    audioChannels: req.body.ChannelsSelect,
    videoVolume: req.body.VolumeSelect,
    SampleRate: req.body.SampleRateSelect,
    AudioBitrateValue: req.body.BitrateValuesSelect,
    desiredKeyframeInterval: req.body.KeyframeInterval,
    subtitlesType: req.body.subtitleType,
    QscaleValue: req.body.selectMenu === '.wmv' ? req.body.Qscale : '',
  };
  // console.log(options);

  return options;
}

// Metadata of the video
function videoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    const command = new fluentFfmpeg();

    command.input(inputPath);
    command.ffprobe((err, metadata) => {
      if (err) {
        console.error('Error in metadata:', err);
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// Trimming
const configureTrimming = (startingTime, endingTime, duration) => {
  console.log(startingTime, endingTime, duration);
  console.log('Video Duration: ', duration, 'seconds');
  let startingInSeconds = functions.parseTime(startingTime);
  let endingInSeconds = functions.parseTime(endingTime);
  let totalDuration, errorMessages;

  if (startingInSeconds < 0 || endingInSeconds < 0) {
    errorMessages = 'Start and end times must be non-negative values.';
  } else if (startingInSeconds >= endingInSeconds || duration <= startingInSeconds || duration < endingInSeconds) {
    errorMessages = 'Invalid start or end time. The duration of this video is ' + duration + ' seconds.';

    // trimming
  } else if (startingTime && endingTime && endingTime !== '00:00:00') {
    let formattedDuration = functions.formatTime(duration);
    console.log('formattedDuration------>>> ', formattedDuration);
    totalDuration = functions.calculateDuration(startingTime, endingTime);
  }
  return { totalDuration, errorMessages };
};

// Video Configuration
async function configureVideoSettings(command, editingoptions) {
  command.videoCodec(editingoptions.videoCOdec);
  if (editingoptions.qualityConstant) {
    command.addOptions([`-crf ${editingoptions.qualityConstant}`]);
  }
  if (editingoptions.tuning && editingoptions.tuning !== 'none') {
    command.addOptions([`-tune ${editingoptions.tuning}`]);
  }
  if (editingoptions.profileValue && editingoptions.profileValue !== 'none') {
    command.addOption(`-profile:v ${editingoptions.profileValue}`);
  }
  if (editingoptions.levelValue && editingoptions.levelValue !== 'none') {
    command.addOptions([`-level ${editingoptions.levelValue}`]);
  }
  if (editingoptions.presetValue) {
    command.addOptions([`-preset ${editingoptions.presetValue}`]);
  }
  if (editingoptions.QscaleValue && editingoptions.selectMenuValues === '.wmv') {
    command.addOption(`-q:v ${editingoptions.QscaleValue}`);
  }
  if (editingoptions.framePersecond) {
    command.addOption('-r', editingoptions.framePersecond);
  }
}

// Audio Configuration
async function configureAudioSettings(command, editingoptions) {
  // audio filter chain
  let audioFilterValues = '';
  if (editingoptions.AudioCodecSelect !== 'copy' && editingoptions.AudioCodecSelect !== 'none') {
    if (editingoptions.videoVolume !== '') {
      audioFilterValues += `volume=${editingoptions.videoVolume},`;
    }
    if (editingoptions.SampleRate !== '') {
      audioFilterValues += `asetrate=${editingoptions.SampleRate},`;
    }
    if (editingoptions.audioFilterValues !== '') {
      audioFilterValues = audioFilterValues.slice(0, -1);
    }
  }

  // Audio Settings
  if (editingoptions.audioCodecSelect === 'none') {
    command.addOption('-an');
  } else if (editingoptions.audioCodecSelect === 'copy') {
    command.audioCodec(editingoptions.audioCodecSelect);
  } else if (editingoptions.audioCodecSelect !== '') {
    // Audio Codec
    command.audioCodec(editingoptions.audioCodecSelect);

    // audio Bitrate
    if (editingoptions.AudioBitrateValue !== '') {
      command.audioBitrate(`${editingoptions.AudioBitrateValue}`);
    }

    // audio channels
    if (editingoptions.audioChannels !== '') {
      console.log(typeof editingoptions.audioChannels);
      console.log(editingoptions.audioChannels);
      command.audioChannels(editingoptions.audioChannels);
    }
    if (audioFilterValues.length > 0) {
      command.audioFilter(`${audioFilterValues}`);
    }
  }
}

// app.post('/video-conversion', async (req, res) => {
async function videoConversionFunction(req, res, next) {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);
    console.log(options);

    const videoUrl = await uploadToVercelBlob(options.inputFile);
    console.log('Uploaded Input File >> ' + videoUrl.url);

    const completeVideoMetadata = await videoMetadata(videoUrl.url);
    console.log(completeVideoMetadata);

    const fileName = options.inputFile[0].originalname.split('.');
    const fileNameIwthoutExtension = fileName[0];
    console.log(fileNameIwthoutExtension);
    const tmpOutputPath = `/tmp/converted-${fileNameIwthoutExtension}${options.selectMenuValues}`;
    const selectedValues = options.selectMenuValues.slice(1);
    console.log(selectedValues);

    let requiredDuration;
    if (options.startingTime && options.endingTime) {
      requiredDuration = configureTrimming(options.startingTime, options.endingTime, completeVideoMetadata.format.duration);
      console.log(requiredDuration);
      trimError = requiredDuration.errorMessages;
    }

    const command = new fluentFfmpeg();
    command.input(videoUrl.url);
    // trimming
    if (requiredDuration) {
      command.setStartTime(options.startingTime);
      command.setDuration(requiredDuration.totalDuration);
    }
    console.log(`Video resolution ORGINAL DIMENSIONS : ${completeVideoMetadata.streams[0].width}x${completeVideoMetadata.streams[0].height}`);
    configureVideoSettings(command, options);
    configureAudioSettings(command, options);

    command.save(tmpOutputPath);
    command.on('end', async () => {
      try {
        const convertedData = await fs.readFileSync(tmpOutputPath);

        // Upload converted file to Vercel Blob
        const convertedBlob = await put(`converted/${fileNameIwthoutExtension}${options.selectMenuValues}`, convertedData, {
          access: 'public',
          contentType: `video/${selectedValues}`,
          token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
        });

        console.log(convertedBlob.url);
        res.json({ downloadUrl: convertedBlob.url, filedeleted: videoUrl.url, metadata: completeVideoMetadata, errorMessage: '' });
      } catch (error) {
        console.error(error);
        res.json({ downloadUrl: 'covnertedFile', filedeleted: 'videoUrl.url', metadata: 'jsonData', errorMessage: '' });
      } finally {
        fs.unlinkSync(tmpOutputPath);
      }
    });

    console.log('process end');
  } catch (error) {
    console.log(error);
    // next(error);
    res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
  }
}

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// // Converting the file
// async function convertVideo(videoStream, options, metadata) {

//   // if (editingoptions.selectMenuValues === '.mp4') {
//   // Add the following line to enable faststart for mp4 format
//   // command.outputOptions(['-movflags', '+faststart']);

//   // Set Resolution
//   if (editingoptions.resolution && editingoptions.resolution !== 'no change') {
//     if (editingoptions.fitValue === 'scale') {
//       command.size(editingoptions.resolution);
//     } else if (editingoptions.fitValue === 'max') {
//       command.autoPad();
//     } else if (editingoptions.fitValue === 'crop') {
//       // command.complexFilter(`crop=${cropWidth}:${cropHeight}`);
//       console.log('Provided Inputs: ', cropHeight, cropWidth, '  --  Provided by File: ', metadata.streams[0].width, metadata.streams[0].height);
//     }
//   }

//   // Set FPS (Frames Per Second)
//   if (editingoptions.framePersecond && editingoptions.framePersecond !== 'none') {
//     command.fps(editingoptions.framePersecond);
//   }

//   // Set Sample Rate
//   if (editingoptions.SampleRate) {
//     command.audioFrequency(editingoptions.SampleRate);
//   }
//   // buffer-size and max-bitrate
//   if (metadata.streams[0].buffer_size && metadata.streams[0].max_bitrate) {
//     command.addOptions([`-bufsize ${metadata.streams[0].buffer_size}`]);
//     command.addOptions([`-maxrate ${metadata.streams[0].max_bitrate}`]);
//   }

//   // console.log('FFmpeg Command:', command.toString());
//   // command.inputOptions('-loglevel debug');
//   // console.log(command.inputOptions('-loglevel debug'));
// }

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// Subtitles
const configureSubtitleSettings = (command, editingoptions, subtitleFileURL) => {
  if (editingoptions.subtitlesType === 'soft' || editingoptions.subtitlesType === 'hard') {
    command.outputOption('-c:s ass');
  }
};

// Watermark
const configureWatermarkSettings = (command, startingTime, duration) => {
  const startSeconds = functions.parseTime(startingTime);
  const durationSeconds = functions.parseTime(duration);

  command.complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${startSeconds},${durationSeconds})'`);
  // command.complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2`);
};

// +-----------------------------------------------------------------------------------------------------------------------------------------+
// MOST UPDATED
const fs = require('fs');
const { put, del } = require('@vercel/blob');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_8oL0c4E3y4emK5Iq_mNmffcqTL3VgnPvoTKAxDK3jiN3PvD';

// functions
const functions = require('./functions');

// file upload
async function uploadToVercelBlob(file) {
  try {
    return await put(file[0].originalname, file[0].buffer, {
      access: 'public',
      contentType: file[0].mimetype,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(error);
  }
}

// Extracting Options From Request
function extractOptionsFromRequest(req) {
  const selectedvaluesincluded = ['.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.m4v', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm'];
  // values when not to include
  const notincludevalues = selectedvaluesincluded.some((format) => req.body.selectMenu.includes(format));

  const options = {
    inputFile: req.files.uploadFile,
    subtitleFiles: req.files.subtitleFile,
    imageWatermark: req.files.waterMarkImage,
    selectMenuValues: req.body.selectMenu,
    selectForFile: req.body.ConvertFromSelect,
    startingTime: req.body.StartingTime,
    endingTime: req.body.EndingTime,
    resolution: req.body.ResolutionMenu,
    videoCOdec: req.body.videotCodecSelect,
    aspectRatio: req.body.AspectRatioSelect,
    qualityConstant: notincludevalues ? '' : req.body.ConstantQualitySelect,
    presetValue: notincludevalues ? '' : req.body.presetSelect,
    tuning: notincludevalues ? '' : req.body.tuneSelect,
    profileValue: notincludevalues ? '' : req.body.profileSelect,
    levelValue: notincludevalues ? '' : req.body.levelSelect,
    fitValue: req.body.fitSelect,
    framePersecond: req.body.fpsSelect,
    audioCodecSelect: req.body.AudioCodec,
    audioChannels: req.body.ChannelsSelect,
    videoVolume: req.body.VolumeSelect,
    SampleRate: req.body.SampleRateSelect,
    AudioBitrateValue: req.body.BitrateValuesSelect,
    desiredKeyframeInterval: req.body.KeyframeInterval,
    subtitlesType: req.body.subtitleType,
    QscaleValue: req.body.selectMenu === '.wmv' ? req.body.Qscale : '',
  };
  // console.log(options);

  return options;
}

// Metadata of the video
function videoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    const command = new fluentFfmpeg();

    command.input(inputPath);
    command.ffprobe((err, metadata) => {
      if (err) {
        console.error('Error in metadata:', err);
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// Trimming
const configureTrimming = (startingTime, endingTime, duration) => {
  console.log(startingTime, endingTime, duration);
  console.log('Video Duration: ', duration, 'seconds');
  let startingInSeconds = functions.parseTime(startingTime);
  let endingInSeconds = functions.parseTime(endingTime);
  let totalDuration, errorMessages;

  if (startingInSeconds < 0 || endingInSeconds < 0) {
    errorMessages = 'Start and end times must be non-negative values.';
  } else if (startingInSeconds >= endingInSeconds || duration <= startingInSeconds || duration < endingInSeconds) {
    errorMessages = 'Invalid start or end time. The duration of this video is ' + duration + ' seconds.';

    // trimming
  } else if (startingTime && endingTime && endingTime !== '00:00:00') {
    let formattedDuration = functions.formatTime(duration);
    console.log('formattedDuration------>>> ', formattedDuration);
    totalDuration = functions.calculateDuration(startingTime, endingTime);
  }
  return { totalDuration, errorMessages };
};

// Video Conversion FFmepg events
const configureFFmpegEvents = (command, tmpOutputPath, fileNameIwthoutExtension, selectMenuValues, selectedValues, completeVideoMetadata, res) => {
  command
    .on('start', () => {
      console.log('message', 'Conversion Started.');
    })
    .on('progress', (progress) => {
      if (progress.percent !== undefined) {
        const progressPercent = progress.percent.toFixed(2);
        console.log(progressPercent);
      }
    })
    .on('end', async () => {
      console.log('100');
      console.log('A Conversion has ended.');
      try {
        const convertedData = await fs.readFileSync(tmpOutputPath);
        // Upload converted file to Vercel Blob
        const convertedBlob = await put(`converted/${fileNameIwthoutExtension}${selectMenuValues}`, convertedData, {
          access: 'public',
          contentType: `video/${selectedValues}`,
          token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
        });

        console.log(convertedBlob.url);
        res.json({ downloadUrl: convertedBlob.url, filedeleted: fileNameIwthoutExtension + selectMenuValues, metadata: completeVideoMetadata, errorMessage: '' });
      } catch (error) {
        console.log(error);
      } finally {
        fs.unlinkSync(tmpOutputPath);
      }
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('Error:', err);
        console.error('FFmpeg stderr:', stderr);
        console.error('FFmpeg stdout:', stdout);

        const errorLines = stderr.split('\n');
        const errorPatterns = /(Could not find|width not|timeline data missing|does not support|muxer does not|compatible|Unsupported codec|width must be|Only VP8 or VP9 or AV1|Streamcopy|Unable to find|encoder setup failed|does not yet support|No such filter|can only be written|only supports|is not available|codec tag found for|only supported in|codec failed|is not supported in|Packet is missing PTS|at most one|Error setting option profile|Possible tunes: psnr ssim grain|Error setting option tune to|Unsupported audio codec. Must be one of| not create encoder reference|Cannot open libx265 encoder | Filter scale)/;
        const errorMessages = errorLines.filter((line) => errorPatterns.test(line));

        let extractedText = '';
        errorMessages.forEach((errorMessage) => {
          const indexOfClosingBracket = errorMessage.indexOf(']');
          if (indexOfClosingBracket !== -1) {
            extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
          }
        });
        console.log('Error  -----------  ', extractedText);

        res.status(500).send('Conversion Error: ' + err.message);
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

let fitValueCheck;

// Video Configuration => Without Trimmed
async function configureVideoSettings(command, editingoptions, metadata) {
  // original resolution
  const originalWidth = metadata.streams[0].width;
  const originalHeight = metadata.streams[0].height;
  console.log(originalWidth, originalHeight);

  // given resolution
  const [givenWidth, givenHeight] = editingoptions.resolution.split('x');
  console.log(givenWidth, givenHeight);

  if (editingoptions.qualityConstant) {
    command.outputOptions([`-crf ${editingoptions.qualityConstant}`]);
  }

  // Set Resolution
  if (editingoptions.resolution !== 'no change') {
    if (editingoptions.fitValue === 'scale') {
      fitValueCheck = `scale=${givenWidth}:${givenHeight}`;
    } else if (editingoptions.fitValue === 'max') {
      fitValueCheck = `scale=w=min(iw\\,${givenWidth}):h=min(ih\\,${givenHeight}):force_original_aspect_ratio=decrease`;
    } else if (editingoptions.fitValue === 'pad') {
      fitValueCheck = `scale=w=${givenWidth}:h=${givenHeight},pad=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2`;
      // fitValueCheck = `scale=w=min(iw\\,${givenWidth}):h=min(ih\\,${givenHeight}):force_original_aspect_ratio=decrease,pad=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2`;
    } else if (editingoptions.fitValue === 'crop') {
      fitValueCheck = `scale=w=${givenWidth}:h=${givenHeight},crop=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2`;
    }
  }

  // Set Aspect Ratio
  if (editingoptions.aspectRatio !== 'no change') {
    command.addOption('-aspect', editingoptions.aspectRatio);
    console.log('aspect ---------------------------- ' + editingoptions.aspectRatio);
  }

  // tune
  if (editingoptions.tuning && editingoptions.tuning !== 'none') {
    command.addOption(`-tune ${editingoptions.tuning}`);
  }
  // profile
  if (editingoptions.profileValue && editingoptions.profileValue !== 'none') {
    command.addOption(`-profile:v ${editingoptions.profileValue}`);
  }
  // level
  if (editingoptions.levelValue && editingoptions.levelValue !== 'none') {
    command.addOption(`-level ${editingoptions.levelValue}`);
  }
  // preset
  if (editingoptions.presetValue) {
    command.addOption(`-preset ${editingoptions.presetValue}`);
  }
  // Qscale
  if (editingoptions.QscaleValue && editingoptions.selectMenuValues === '.wmv') {
    command.addOption(`-q:v ${editingoptions.QscaleValue}`);
  }
  // FPS
  if (editingoptions.framePersecond) {
    command.addOption('-r', editingoptions.framePersecond);
  }
  // Key Frame Interval
  if (editingoptions.desiredKeyframeInterval) {
    command.addOption(`-g ${editingoptions.desiredKeyframeInterval}`);
  }

  // buffer-size and max-bitrate
  if (metadata.streams[0].buffer_size && metadata.streams[0].max_bitrate) {
    command.addOption(`-bufsize ${metadata.streams[0].buffer_size}`);
    command.addOption(`-maxrate ${metadata.streams[0].max_bitrate}`);
  }
}

// Audio Configuration
async function configureAudioSettings(command, editingoptions) {
  // audio filter chain
  let audioFilterValues = '';
  if (editingoptions.AudioCodecSelect !== 'copy' && editingoptions.AudioCodecSelect !== 'none') {
    if (editingoptions.videoVolume !== '') {
      audioFilterValues += `volume=${editingoptions.videoVolume},`;
    }
    if (editingoptions.SampleRate !== '') {
      audioFilterValues += `asetrate=${editingoptions.SampleRate},`;
    }
    if (editingoptions.audioFilterValues !== '') {
      audioFilterValues = audioFilterValues.slice(0, -1);
    }
  }

  // Audio Settings
  if (editingoptions.audioCodecSelect === 'none') {
    command.addOption('-an');
  } else if (editingoptions.audioCodecSelect === 'copy') {
    command.audioCodec(editingoptions.audioCodecSelect);
  } else if (editingoptions.audioCodecSelect !== '') {
    // Audio Codec
    command.audioCodec(editingoptions.audioCodecSelect);

    // audio Bitrate
    if (editingoptions.AudioBitrateValue !== '') {
      command.audioBitrate(`${editingoptions.AudioBitrateValue}`);
    }

    // audio channels
    if (editingoptions.audioChannels !== '') {
      console.log(typeof editingoptions.audioChannels);
      console.log(editingoptions.audioChannels);
      command.audioChannels(editingoptions.audioChannels);
    }
    if (audioFilterValues.length > 0) {
      command.audioFilter(`${audioFilterValues}`);
    }
  }
}

// let subtitlesFilter;
// Subtitles
const configureSubtitleSettings = (command, options, path) => {
  // if (options.subtitlesType === 'soft' || options.subtitlesType === 'hard') {
  if (options.subtitlesType === 'soft') {
    command.outputOption('-c:s ass');
    // } else if (options.subtitlesType === 'hard') {
    //   // const subtitlesFilter = `[0:v][0:s]subtitles=${path}[v]`;
    //   subtitlesFilter = `[video][0:s]subtitles=${path}`;
    //   subtitlesFilter = `[0:v][0:s]subtitles=${subtitleUrl.url}[v]`;
    //   // command.complexFilter(subtitlesFilter);
    //   // command.map('[v]');
  } else if (options.subtitlesType === 'copy') {
    command.addOption('-map', '0:s');
  }
};

// // WaterMark
// const configureWatermarkSettings = (command, options, imageFileULR) => {
//   command.complexFilter(['[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]', '[0:v][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2']);
// };

// const configureWatermarkSettings = (command, options, imageFileULR) => {
//   // // Apply Resolution Filter
//   // if (options.resolution !== 'no change') {
//   //   const [givenWidth, givenHeight] = options.resolution.split('x');
//   //   command.complexFilter(`[0:v]scale=${givenWidth}:${givenHeight}[scaled]`);
//   // }

//   const resolutionDimensions = '[0:v]scale=w=640:h=480[resolution]';
//   const watermarkConfig = '[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]';
//   const watermarkPosition = '[resolution][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2';
//   command.complexFilter([resolutionDimensions, watermarkConfig, watermarkPosition]);

//   // // Apply Watermark Filter
//   // command.complexFilter('[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]');

//   // // Overlay Watermark
//   // command.complexFilter('[watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[out]');
// };

let watermarkConfig, watermarkPosition;
let subtitlesFilter;

watermarkConfig = '[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]';
watermarkPosition = '[resolution][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2';
// resolutionDimensions = '[0:v]scale=w=640:h=480[resolution]';

// Function
async function videoConversionFunction(req, res, next) {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);
    console.log(options);

    // uploading the files
    const videoPromise = uploadToVercelBlob(options.inputFile);
    let subtitlePromise, waterMarkImagePromise;
    if (options.subtitleFiles && options.subtitlesType !== 'none' && options.subtitlesType !== 'copy') {
      subtitlePromise = uploadToVercelBlob(options.subtitleFiles);
    }
    if (options.imageWatermark) {
      waterMarkImagePromise = uploadToVercelBlob(options.imageWatermark);
    }

    const [videoUrl, subtitleUrl, watermarkUrl] = await Promise.all([videoPromise, subtitlePromise, waterMarkImagePromise]);
    // metadata
    const completeVideoMetadata = await videoMetadata(videoUrl.url);

    // checking the link for the file
    console.log('Uploaded Input File >> ' + videoUrl.url);
    if (subtitleUrl) {
      console.log('Uploaded Subtitle File >> ' + subtitleUrl.url);
    }
    if (watermarkUrl) {
      console.log('Uploaded Watermark File >> ' + watermarkUrl.url);
    }
    console.log(completeVideoMetadata);

    const fileName = options.inputFile[0].originalname.split('.');
    const fileNameIwthoutExtension = fileName[0];
    console.log(fileNameIwthoutExtension);
    const tmpOutputPath = `/tmp/converted-${fileNameIwthoutExtension}${options.selectMenuValues}`;
    const selectedValues = options.selectMenuValues.slice(1);
    console.log(selectedValues);
    const videoStream = completeVideoMetadata.streams.find((stream) => stream.codec_type === 'video');

    let requiredDuration;
    if (options.startingTime && options.endingTime) {
      requiredDuration = configureTrimming(options.startingTime, options.endingTime, completeVideoMetadata.format.duration);
      console.log(requiredDuration);
      trimError = requiredDuration.errorMessages;
    }

    // subtitlesFilter = `[video][0:s]subtitles=${subtitleUrl.url}`;
    // subtitlesFilter = `[0:v][0:s]subtitles=${subtitleUrl.url}`;

    const [givenWidth, givenHeight] = options.resolution.split('x');
    console.log(givenWidth, givenHeight);

    // command.complexFilter(`[0:v]subtitles=${path}:force_style='Fontsize=20'`);
    // subtitlesFilter = `[resolution][0:s]subtitles=${subtitleUrl.url}:force_style='Fontsize=20'`;
    // subtitlesFilter = `[0:v][0:s]subtitles=${subtitleUrl.url}'`;
    // subtitlesFilter = '[0:v][0:s]overlay';

    let resolutionDimensions;
    if (options.resolution !== 'no change') {
      if (options.fitValue === 'scale') {
        resolutionDimensions = `[0:v]scale=w=${givenWidth}:h=${givenHeight}[resolution]`;
      } else if (options.fitValue === 'max') {
        resolutionDimensions = `[0:v]scale=w=min(iw\\,${givenWidth}):h=min(ih\\,${givenHeight}):force_original_aspect_ratio=decrease[resolution]`;
      } else if (options.fitValue === 'pad') {
        resolutionDimensions = `[0:v]pad=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2[resolution]`;
      } else if (options.fitValue === 'crop') {
        // resolutionDimensions = `[0:v]crop=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2[resolution]`;
        resolutionDimensions = `[0:v]scale=w=${givenWidth}:h=${givenHeight},crop=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2[resolution]`;
      }
    }

    // let subtitlesFilter = `[0:v][0:s]subtitles=${subtitleUrl.url}[v]`;

    const command = new fluentFfmpeg();

    // video File
    command.input(videoUrl.url);

    // FFmpeg-Events (Start, Progress, End, Error)
    configureFFmpegEvents(command, tmpOutputPath, fileNameIwthoutExtension, options.selectMenuValues, selectedValues, completeVideoMetadata, res);

    // trimming
    if (requiredDuration) {
      command.setStartTime(options.startingTime);
      command.setDuration(requiredDuration.totalDuration);
    }

    // SRT|ASS (Subtitle) File
    if (options.subtitleFiles && options.subtitlesType !== 'none' && options.subtitlesType !== 'copy') {
      command.input(subtitleUrl.url);
    }

    // Image(watermark) File
    if (options.imageWatermark) {
      command.input(watermarkUrl.url);
    }

    // Video-Configuration
    command.videoCodec(options.videoCOdec);
    if (options.videoCOdec !== 'copy') {
      configureVideoSettings(command, options, completeVideoMetadata);
    }
    // Audio-Configuration
    configureAudioSettings(command, options);

    console.log(`Video resolution ORGINAL DIMENSIONS : ${completeVideoMetadata.streams[0].width}x${completeVideoMetadata.streams[0].height}`);

    // checking for multiple video streams
    if (options.selectMenuValues === '.flv' || options.selectMenuValues === '.mkv') {
      if (videoStream && videoStream.length > 1) {
        command.inputOptions(['-map 0:v:0']);
      }
    }

    command.videoCodec(options.videoCOdec);
    if (options.videoCOdec !== 'copy') {
      configureVideoSettings(command, options, completeVideoMetadata);
    }
    configureAudioSettings(command, options);

    // watermark
    if (options.imageWatermark) {
      // configureWatermarkSettings(command, options, watermarkUrl.url);
      command.complexFilter([resolutionDimensions, watermarkConfig, watermarkPosition]);
      // } else if (options.subtitleFiles && options.subtitlesType === 'hard') {
      //   //

      //   // command.complexFilter(`[0:v]subtitles=${subtitleUrl.url}:force_style='Fontsize=20'[noPriorSubtitles]`);

      //   // subtitlesFilter = `[1:v]subtitles='${subtitleUrl.url}':force_style='Fontsize=20'[subtitled]`;
      //   subtitlesFilter = `[0:v][0:s]subtitles=${subtitleUrl.url}:force_style='Fontsize=20'[subtitled]`;

      //   // Overlay Subtitles

      //   // command.complexFilter(subtitlesFilter);
      //   // command.map('[subtitled]');

      //   command.complexFilter([subtitlesFilter, '[subtitled]overlay']);
      // command.complexFilter([fitValueCheck, subtitlesFilter, '[subtitled]overlay']);
      // command.complexFilter([resolutionDimensions, subtitlesFilter]);
    } else {
      command.complexFilter(fitValueCheck);
    }

    // subtitle
    if (options.subtitleFiles && options.subtitlesType === 'soft') {
      configureSubtitleSettings(command, options, subtitleUrl.url);
    }

    if (options.selectMenuValues !== '.flv' && options.selectMenuValues !== '.mkv') {
      command.outputOptions(['-map 0', '-dn']);
    }

    command.save(tmpOutputPath);

    console.log('process end');
  } catch (error) {
    console.log(error);
    res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
  }
}

module.exports = { videoConversionFunction };

// +-----------------------------------------------------------------------------------------------------------------------------------------+

// // WaterMark
// const configureWatermarkSettings = (command, options, imageFileULR) => {
//   command.complexFilter(['[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]', '[0:v][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2']);
// };

// const configureWatermarkSettings = (command, options, imageFileULR) => {
//   // // Apply Resolution Filter
//   // if (options.resolution !== 'no change') {
//   //   const [givenWidth, givenHeight] = options.resolution.split('x');
//   //   command.complexFilter(`[0:v]scale=${givenWidth}:${givenHeight}[scaled]`);
//   // }

//   const resolutionDimensions = '[0:v]scale=w=640:h=480[resolution]';
//   const watermarkConfig = '[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]';
//   const watermarkPosition = '[resolution][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2';
//   command.complexFilter([resolutionDimensions, watermarkConfig, watermarkPosition]);

//   // // Apply Watermark Filter
//   // command.complexFilter('[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]');

//   // // Overlay Watermark
//   // command.complexFilter('[watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[out]');
// };

// +-----------------------------------------------------------------------------------------------------------------------------------------+
