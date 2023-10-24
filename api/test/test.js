// app.post('/convert', (req, res) => {
//   let inputFile = req.files.uploadFile;
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

//   io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, async function (err) {
//     if (err) {
//       io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       io.emit('message', 'File Uploaded Successfully.');

//       const inputPath = `./temp-files/${inputFile.name}`;
//       const lastDotIndex = inputFile.name.lastIndexOf('.');
//       const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
//       const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
//       let errorMessage = '';
//       let watermarkPath = '';

//       if (imageWatermark) {
//         io.emit('message', 'Saving WaterMark');
//         imageWatermark.mv('temp-files/' + imageWatermark.name, function (err) {
//           console.log('imageWatermark saved');
//           if (err) {
//             io.emit('message', 'WaterMark Saved Error: ' + err.message);
//             return res.status(500).send(err);
//           } else {
//             io.emit('message', 'WaterMark Saved Successfully.');
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
//         io.emit('message', 'Conversion Started.');
//       });
//       // covnersion in progress
//       command.on('progress', (progress) => {
//         if (progress.percent !== undefined) {
//           const progressPercent = progress.percent.toFixed(2);
//           io.emit('progress', progressPercent);
//         }
//       });
//       // covnersion end
//       command.on('end', () => {
//         progressPercent = 100;
//         io.emit('progress', progressPercent);
//         io.emit('message', 'Conversion Finished.');
//       });
//       // covnersion error
//       command.on('error', (err) => {
//         io.emit('message', 'Conversion Error: ' + err.message);
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

// io.on('connection', (socket) => {
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

//   io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, async function (err) {
//     if (err) {
//       io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       io.emit('message', 'File Uploaded Successfully.');

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
//         io.emit('message', 'Conversion Started.');
//       });
//       // covnersion in progress
//       command.on('progress', (progress) => {
//         if (progress.percent !== undefined) {
//           const progressPercent = progress.percent.toFixed(2);
//           io.emit('progress', progressPercent);
//         }
//       });
//       // covnersion end
//       command.on('end', () => {
//         progressPercent = 100;
//         io.emit('progress', progressPercent);
//         io.emit('message', 'Conversion Finished.');
//       });
//       // covnersion error
//       command.on('error', (err) => {
//         io.emit('message', 'Conversion Error: ' + err.message);
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

// io.on('connection', (socket) => {
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
    io.emit('message', 'Conversion Started.');
  })
  .on('stderr', (stderrLine) => {
    commandError += stderrLine + '\n';
  })
  .on('end', () => {
    io.emit('message', 'Conversion Finished.');
    console.log('FFmpeg command finished.');
    console.log('FFmpeg output:', commandOutput);
    console.log('FFmpeg error:', commandError);
  })
  .on('error', (err, stdout, stderr) => {
    console.error('Error:', err);
    console.error('FFmpeg stderr:', stderr);
    io.emit('message', 'Conversion Error: ' + err.message);
    res.status(500).send('Conversion Error: ' + err.message);
  })
  .on('progress', (progress) => {
    if (progress.percent !== undefined) {
      const progressPercent = progress.percent.toFixed(2);
      io.emit('progress', progressPercent);
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
