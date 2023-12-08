const fs = require('fs');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

// routes
// const router = require('./router');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

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

// // Trimming
// const configureTrimming = async (startingTime, endingTime, duration) => {
//   console.log('Video Duration: ', duration, 'seconds');
//   let startingInSeconds = functions.parseTime(startingTime);
//   let endingInSeconds = functions.parseTime(endingTime);
//   let totalDuration, errorMessages;

//   if (startingInSeconds < 0 || endingInSeconds < 0) {
//     errorMessages = 'Start and end times must be non-negative values.';
//   } else if (startingInSeconds >= endingInSeconds || duration <= startingInSeconds || duration < endingInSeconds) {
//     errorMessages = 'Invalid start or end time. The duration of this video is ' + duration + ' seconds.';

//     // trimming
//   } else if (startingTime && endingTime && endingTime !== '00:00:00') {
//     let formattedDuration = functions.formatTime(duration);
//     console.log('formattedDuration------>>> ', formattedDuration);
//     totalDuration = functions.calculateDuration(startingTime, endingTime);
//   }
//   return { totalDuration, errorMessages };
// };

// // Converting the file
// async function convertVideo(videoStream, editingoptions, metadata) {
//   const completeDuration = metadata.format.duration;

//   const withoutDotSelectMenu = editingoptions.selectMenuValues.slice(1);
//   const withoutDotFileName = editingoptions.inputFile[0].originalname.split('.');
//   console.log(withoutDotFileName[0]);
//   let [cropWidth, cropHeight] = editingoptions.resolution.split('x');

//   let requiredDuration, trimError;

//   if (editingoptions.startingTime && editingoptions.endingTime) {
//     requiredDuration = await configureTrimming(editingoptions.startingTime, editingoptions.endingTime, completeDuration);
//     trimError = requiredDuration.errorMessages;
//   }
//   console.log(trimError);

//   const outputStream = new PassThrough();
//   const command = fluentFfmpeg();
//   command.input(videoStream);
//   command.format(withoutDotSelectMenu);

//   // if (editingoptions.selectMenuValues === '.mp4') {
//   // Add the following line to enable faststart for mp4 format
//   // command.outputOptions(['-movflags', '+faststart']);

//   // AV-COdecs
//   command.videoCodec(editingoptions.videoCOdec);
//   command.audioCodec(editingoptions.audioCodecSelect);

//   // Video-Options

//   // Set Resolution
//   if (editingoptions.resolution && editingoptions.resolution !== 'no change') {
//     if (editingoptions.fitValue === 'scale') {
//       command.size(editingoptions.resolution);
//       command.crop;
//       console.log(editingoptions.resolution);
//     } else if (editingoptions.fitValue === 'max') {
//       command.autoPad();
//     } else if (editingoptions.fitValue === 'crop') {
//       // command.complexFilter(`crop=${cropWidth}:${cropHeight}`);
//       console.log('Provided Inputs: ', cropHeight, cropWidth, '  --  Provided by File: ', metadata.streams[0].width, metadata.streams[0].height);
//     }
//   }

//   // Set Aspect Ratio
//   if (editingoptions.aspectRatio && editingoptions.aspectRatio !== 'no change') {
//     command.aspect(editingoptions.aspectRatio);
//     console.log(editingoptions.aspectRatio);
//   }
//   // Set Constant Quality (CRF)
//   if (editingoptions.qualityConstant) {
//     command.withVideoBitrate(editingoptions.qualityConstant);
//     command.videoBitrate(editingoptions.qualityConstant);
//     console.log(editingoptions.qualityConstant);
//   }

//   // CRF
//   if (editingoptions.qualityConstant) {
//     command.addOptions([`-crf ${editingoptions.qualityConstant}`]);
//   }

//   // Set FPS (Frames Per Second)
//   if (editingoptions.framePersecond && editingoptions.framePersecond !== 'none') {
//     command.fps(editingoptions.framePersecond);
//   }
//   // Set Channels
//   if (editingoptions.audioChannels && editingoptions.audioChannels !== 'no change') {
//     command.audioChannels(editingoptions.audioChannels);
//   }
//   // Set Sample Rate
//   if (editingoptions.SampleRate) {
//     command.audioFrequency(editingoptions.SampleRate);
//   }
//   // Set Audio Bitrate
//   if (editingoptions.AudioBitrateValue && editingoptions.aspectRatio !== 'none') {
//     command.audioBitrate(editingoptions.AudioBitrateValue);
//   }
//   // Set Volume
//   if (editingoptions.videoVolume && editingoptions.videoVolume !== 'no change') {
//     command.audioFilters([`volume=${editingoptions.videoVolume}`]);
//   }

//   // Set Profile
//   if (editingoptions.profileValue && editingoptions.profileValue !== 'none') {
//     command.addOption('-profile:v', editingoptions.profileValue);
//     console.log(editingoptions.profileValue);
//   }
//   // Set Level
//   if (editingoptions.levelValue && editingoptions.levelValue !== 'none') {
//     command.addOption('-level:v', editingoptions.levelValue);
//     console.log(editingoptions.levelValue);
//   }
//   // Set Preset
//   if (editingoptions.presetValue && editingoptions.presetValue !== 'none') {
//     command.addOption('-preset', editingoptions.presetValue);
//     console.log(editingoptions.presetValue);
//   }
//   // Set Tune
//   if (editingoptions.tuning && editingoptions.tuning !== 'none') {
//     command.addOption('-tune', editingoptions.tuning);
//     console.log(editingoptions.tuning);
//   }

//   // buffer-size and max-bitrate
//   if (metadata.streams[0].buffer_size && metadata.streams[0].max_bitrate) {
//     command.addOptions([`-bufsize ${metadata.streams[0].buffer_size}`]);
//     command.addOptions([`-maxrate ${metadata.streams[0].max_bitrate}`]);
//   }

//   // Key Frame Interval
//   if (editingoptions.desiredKeyframeInterval) {
//     command.addOption(`-g ${editingoptions.desiredKeyframeInterval}`);
//   }

//   // trimming
//   if (requiredDuration) {
//     command.setStartTime(editingoptions.startingTime);
//     command.setDuration(requiredDuration.totalDuration);
//   }

//   command.on('end', () => {
//     console.log('Video conversion completed');
//   });

//   // console.log(stdin);
//   // console.log(stdout);

//   command.on('error', (error, stderr, stdout) => {
//     console.error('Error during video conversion:', error);
//     console.error('Error during STDERR:', stderr);
//     console.error('Error during STDERR:', stdout);
//   });

//   // console.log('FFmpeg Command:', command.toString());
//   // command.inputOptions('-loglevel debug');
//   // console.log(command.inputOptions('-loglevel debug'));

//   command.pipe(outputStream);

//   return outputStream;
// }

// // Video conversion process
// async function videoConversionFunction(req, res) {
//   try {
//     console.log('Process Start.....');
//     const options = extractOptionsFromRequest(req);
//     // console.log(options);

//     const inputFileRef = ref(storage, `${options.inputFile[0].originalname}`);
//     await uploadBytes(inputFileRef, options.inputFile[0].buffer);

//     const inputDownloadUrl = await getDownloadURL(inputFileRef);
//     console.log('Uploaded Input File >> ' + inputDownloadUrl);

//     // console.log('downloaded.....');
//     const completeVideoMetadata = await videoMetadata(inputDownloadUrl);
//     // console.log(completeVideoMetadata);

//     // const convertedStream = await convertVideo(videoStream, options, completeVideoMetadata);

//     res.json({ downloadUrl: inputDownloadUrl, filedeleted: inputDownloadUrl, metadata: completeVideoMetadata, errorMessage: '' });

//     console.log('process end');
//   } catch (error) {
//     console.error(error);
//     res.json({ downloadUrl: 'processedVideo.url', filedeleted: 'inputVideo.url', metadata: 'completeVideoMetadata', errorMessage: error.message });
//   }
// }

async function videoConversionFunction(req, res) {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);
    // console.log(options);

    const videoUrl = await uploadToVercelBlob(options.inputFile);
    console.log('Uploaded Input File >> ' + videoUrl.url);

    // const videoStream = await downloadVideo(videoUrl.url);
    console.log('downloaded.....');
    const completeVideoMetadata = await videoMetadata(videoUrl.url);
    console.log(completeVideoMetadata);

    const fileName = options.inputFile[0].originalname.split('.');
    const fileNameIwthoutExtension = fileName[0];
    console.log(fileNameIwthoutExtension);
    const tmpOutputPath = `/tmp/converted-${fileNameIwthoutExtension}${options.selectMenuValues}`;
    // let covnertedFile = options.selectMenuValues.tirm();
    const selectedValues = options.selectMenuValues.slice(1);
    console.log(selectedValues);

    const command = fluentFfmpeg();
    command.input(videoUrl.url);
    command.outputOptions(['-c:v libx264']);
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

        // covnertedFile = convertedBlob.url;
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
    res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
  }
}

module.exports = { videoConversionFunction };
