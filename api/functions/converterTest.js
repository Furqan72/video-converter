const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');
const { PassThrough } = require('stream');

fluentFfmpeg.setFfmpegPath(ffmpegStatic);
fluentFfmpeg.setFfprobePath(ffprobeStatic.path);

// vercel token
const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

// functions
const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');

// video conversion function
const videoConversionFunction = async (req, res) => {
  try {
    console.log('Process Start....');
    const editingoptions = extractOptionsFromRequest(req);
    const withoutDotSelectMenu = editingoptions.selectMenuValues.slice(1);
    const withoutDotFileName = editingoptions.inputFile[0].originalname.split('.');
    console.log(withoutDotFileName[0]);

    const [videoUrl] = await Promise.all([uploadToVercelBlob(req.files.uploadFile)]);
    console.log('Done Uploading... ' + videoUrl.url);

    const downloadUrl = videoUrl.url;
    const videoMetadata = await getVideoMetadata(downloadUrl);

    const videoResponse = await fetch(downloadUrl);
    console.log('Done Downloading...');
    const videoStream = await videoResponse.body;
    const outputStream = new PassThrough();

    const command = fluentFfmpeg();
    command.input(videoStream);
    command.format(withoutDotSelectMenu);

    command.on('error', (err, stdout, stderr) => {
      console.error('Error:', err.message);
      console.error('ffmpeg stdout:', stdout);
      console.error('ffmpeg stderr:', stderr);
      return;
    });

    command.videoCodec(editingoptions.videoCOdec);
    console.log(editingoptions.videoCOdec);

    command.audioCodec(editingoptions.AudioCodecSelect);
    console.log(editingoptions.AudioCodecSelect);
    command.pipe(outputStream);
    console.log('Done Conversion...');

    const processedVideo = await put(`${withoutDotFileName}${editingoptions.selectMenuValues}`, outputStream, {
      access: 'public',
      contentType: `video/${editingoptions.selectMenuValues}`,
      token: blobReadWriteToken,
    });

    console.log('Done Re-Uploading...' + processedVideo.url);
    await del(videoUrl.url, { token: blobReadWriteToken });
    res.json({ downloadUrl: processedVideo.url, filedeleted: videoUrl.url, metadata: videoMetadata, errorMessage: '' });

    console.log('Done Deleting Input File...' + videoUrl.url);
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

const uploadToVercelBlob = async (file) => {
  try {
    return await put(file[0].originalname, file[0].buffer, {
      access: 'public',
      contentType: file[0].mimetype,
      token: blobReadWriteToken,
    });
  } catch (error) {
    console.log(error);
  }
};

function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    fluentFfmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
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
    AudioCodecSelect: req.body.AudioCodec,
    Channels: req.body.ChannelsSelect,
    videoVolume: req.body.VolumeSelect,
    SampleRate: req.body.SampleRateSelect,
    AudioBitrateValue: req.body.BitrateValuesSelect,
    desiredKeyframeInterval: req.body.KeyframeInterval,
    subtitlesType: req.body.subtitleType,
    QscaleValue: req.body.selectMenu === '.wmv' ? req.body.Qscale : '',
  };
  // console.log(options);
  return options;
};

module.exports = { videoConversionFunction };
