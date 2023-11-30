const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');
const { PassThrough } = require('stream');
const { log } = require('console');

const ffmpegBinaryPath = './ffmpegBinary/ffmpeg.exe';
// const ffmpegBinaryPath = 'G:\\video-converter\\api\\ffmpeg\\ffmpeg.exe';

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);

const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

// functions
const functions = require('../functions/functions');

// const { fileName } = require('../global/globalFunctions');
// const { exec } = require('child_process');

// const command = `${ffmpegBinaryPath} -formats`;

// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing FFmpeg: ${error.message}`);
//     return;
//   }

//   console.log('Available Formats:', stdout);
// });

// console.log(ffmpegPath);

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

// file download
async function downloadVideo(url) {
  const response = await fetch(url);
  const videoStream = await response.body;
  return videoStream;
}

// Trimming
const configureTrimming = async (startingTime, endingTime, duration) => {
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

// Converting the file
async function convertVideo(videoStream, editingoptions, metadata) {
  const completeDuration = metadata.format.duration;

  const withoutDotSelectMenu = editingoptions.selectMenuValues.slice(1);
  const withoutDotFileName = editingoptions.inputFile[0].originalname.split('.');
  console.log(withoutDotFileName[0]);
  let [cropWidth, cropHeight] = editingoptions.resolution.split('x');

  let requiredDuration, trimError;

  if (editingoptions.startingTime && editingoptions.endingTime) {
    requiredDuration = await configureTrimming(editingoptions.startingTime, editingoptions.endingTime, completeDuration);
    trimError = requiredDuration.errorMessages;
  }
  console.log(trimError);

  const outputStream = new PassThrough();
  const command = fluentFfmpeg();
  command.input(videoStream);
  // Add the following line to enable faststart for mp4 format
  if (editingoptions.selectMenuValues === '.mp4') {
    command.outputOptions(['-movflags', '+faststart']);
  }
  // command.output(`converted-video${editingoptions.selectMenuValues}`);
  command.format(withoutDotSelectMenu);

  // AV-COdecs
  command.videoCodec(editingoptions.videoCOdec);
  command.audioCodec(editingoptions.audioCodecSelect);

  // Video-Options

  // Set Resolution
  if (editingoptions.resolution && editingoptions.resolution !== 'no change') {
    if (editingoptions.fitValue === 'scale') {
      command.size(editingoptions.resolution);
      command.crop;
      console.log(editingoptions.resolution);
    } else if (editingoptions.fitValue === 'max') {
      command.autoPad();
    } else if (editingoptions.fitValue === 'crop') {
      // command.complexFilter(`crop=${cropWidth}:${cropHeight}`);
      console.log('Provided Inputs: ', cropHeight, cropWidth, '  --  Provided by File: ', metadata.streams[0].width, metadata.streams[0].height);
    }
  }

  // Set Aspect Ratio
  if (editingoptions.aspectRatio && editingoptions.aspectRatio !== 'no change') {
    command.aspect(editingoptions.aspectRatio);
    console.log(editingoptions.aspectRatio);
  }
  // Set Constant Quality (CRF)
  if (editingoptions.qualityConstant && editingoptions.qualityConstant !== 'none') {
    command.videoBitrate(editingoptions.qualityConstant);
    console.log(editingoptions.qualityConstant);
  }
  // Set FPS (Frames Per Second)
  if (editingoptions.framePersecond && editingoptions.framePersecond !== 'none') {
    command.fps(editingoptions.framePersecond);
  }
  // Set Channels
  if (editingoptions.audioChannels && editingoptions.audioChannels !== 'no change') {
    command.audioChannels(editingoptions.audioChannels);
  }
  // Set Sample Rate
  if (editingoptions.SampleRate) {
    command.audioFrequency(editingoptions.SampleRate);
  }
  // Set Audio Bitrate
  if (editingoptions.AudioBitrateValue && editingoptions.aspectRatio !== 'none') {
    command.audioBitrate(editingoptions.AudioBitrateValue);
  }
  // Set Volume
  if (editingoptions.videoVolume && editingoptions.videoVolume !== 'no change') {
    command.audioFilters([`volume=${editingoptions.videoVolume}`]);
  }

  // Set Profile
  if (editingoptions.profileValue && editingoptions.profileValue !== 'none') {
    command.addOption('-profile:v', editingoptions.profileValue);
    console.log(editingoptions.profileValue);
  }
  // Set Level
  if (editingoptions.levelValue && editingoptions.levelValue !== 'none') {
    command.addOption('-level:v', editingoptions.levelValue);
    console.log(editingoptions.levelValue);
  }
  // Set Preset
  if (editingoptions.presetValue && editingoptions.presetValue !== 'none') {
    command.addOption('-preset', editingoptions.presetValue);
    console.log(editingoptions.presetValue);
  }
  // Set Tune
  if (editingoptions.tuning && editingoptions.tuning !== 'none') {
    command.addOption('-tune', editingoptions.tuning);
    console.log(editingoptions.tuning);
  }

  // Key Frame Interval
  if (editingoptions.desiredKeyframeInterval) {
    command.addOption(`-g ${editingoptions.desiredKeyframeInterval}`);
  }

  // trimming
  if (requiredDuration) {
    command.setStartTime(editingoptions.startingTime);
    command.setDuration(requiredDuration.totalDuration);
  }

  // await new Promise((resolve, reject) => {
  command.on('end', () => {
    console.log('Video conversion completed');
    // resolve(outputStream);
  });

  command.on('error', (error, stderr, stdout) => {
    console.error('Error during video conversion:', error);
    console.error('Error during STDERR:', stderr);
    console.error('Error during STDERR:', stdout);
    // reject(error);
  });
  command.pipe(outputStream);

  // });

  return outputStream;
}

// Re-uploading the file
async function uploadConvertedVideo(outputStream, options) {
  const videoData = await outputStream;
  const withoutDotSelectMenu = options.selectMenuValues.slice(1);

  const outputFileName = `converted-video${options.selectMenuValues}`;
  const content = `video/${withoutDotSelectMenu}`;

  const processedVideo = await put(outputFileName, videoData, {
    access: 'public',
    contentType: content,
    token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
  });
  return processedVideo;
}

// Video conversion process
async function videoConversionFunction(req, res) {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);
    // console.log(options);
    const videoUrl = await uploadToVercelBlob(options.inputFile);
    console.log('Uploaded Input File >> ' + videoUrl.url);

    const videoStream = await downloadVideo(videoUrl.url);
    console.log('downloaded.....');
    const completeVideoMetadata = await videoMetadata(videoUrl.url);
    // console.log(completeVideoMetadata);

    const convertedStream = await convertVideo(videoStream, options, completeVideoMetadata);
    const processedVideo = await uploadConvertedVideo(convertedStream, options);
    console.log(processedVideo.url);

    res.json({ downloadUrl: processedVideo.url, filedeleted: videoUrl.url, metadata: completeVideoMetadata, errorMessage: '' });
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: 'processedVideo.url', filedeleted: 'inputVideo.url', metadata: 'completeVideoMetadata', errorMessage: error.message });
  }
}

module.exports = { videoConversionFunction };
