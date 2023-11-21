const ffmpeg = require('fluent-ffmpeg');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

const fs = require('fs');

// // vercel token
const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

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

// Video Conversion FFmepg events
const configureFFmpegEvents = (command, res) => {
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
    .on('end', () => {
      console.log('message', 'Conversion Finished.');
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('Error:', err);
        console.error('FFmpeg stderr:', stderr);
        console.error('FFmpeg stdout:', stdout);

        const errorLines = stderr.split('\n');
        const errorPatterns = /(Could not find|width not|compatible|Unsupported codec|width must be|Only VP8 or VP9 or AV1|Streamcopy|Unable to find|encoder setup failed|does not yet support|can only be written|only supports|is not available|codec tag found for|only supported in|codec failed|is not supported in|Packet is missing PTS|at most one|Error setting option profile|Possible tunes: psnr ssim grain|Error setting option tune to|Unsupported audio codec. Must be one of| not create encoder reference|Cannot open libx265 encoder)/;
        const errorMessages = errorLines.filter((line) => errorPatterns.test(line));

        let extractedText = '';
        errorMessages.forEach((errorMessage) => {
          const indexOfClosingBracket = errorMessage.indexOf(']');
          if (indexOfClosingBracket !== -1) {
            extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
          }
        });
        console.log('Error  -----------  ', extractedText);

        // res.status(500).send('Conversion Error: ' + err.message);
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

// video conversion function
const videoConversionFunction = async (req, res) => {
  try {
    console.log('Process Start....');
    const [videoUrl] = await Promise.all([uploadToVercelBlob(req.files.uploadFile)]);
    console.log('Done Uploading... ' + videoUrl.url);

    const downloadUrl = videoUrl.url;
    const videoResponse = await fetch(downloadUrl);
    console.log('Done Downloading...');

    const editingoptions = extractOptionsFromRequest(req);

    const videoStream = videoResponse.body;
    const videoMetadata = await getVideoMetadata(downloadUrl);
    console.log(videoMetadata);
    const formatWithoutLeadingDot = editingoptions.selectMenuValues.slice(1);

    const command = new ffmpeg();
    command.input(videoStream);

    if (editingoptions.videoCOdec) {
      command.videoCodec(editingoptions.videoCOdec);
    }

    if (editingoptions.AudioCodecSelect) {
      command.audioCodec(editingoptions.AudioCodecSelect);
    }

    command.format(formatWithoutLeadingDot);
    configureFFmpegEvents(command, res);

    const sharpStream = await command.on('info', (info) => console.log('Processing progress:', info));
    console.log('Done Conversion...');

    const processedVideo = await put(`${downloadUrl.split('.')[0]}${editingoptions.selectMenuValues}`, sharpStream, {
      access: 'public',
      contentType: `video/${formatWithoutLeadingDot}`,
      token: blobReadWriteToken,
    });

    console.log(processedVideo);

    const processedVideoPath = `temp-output/${processedVideo.url.split('/').pop()}`;
    fs.writeFileSync(processedVideoPath, sharpStream);

    console.log('Done Re-Uploading...' + processedVideo.url);
    res.json({ downloadUrl: processedVideo.url, filedeleted: videoUrl.url, metadata: videoMetadata, errorMessage: '' });
    await del(videoUrl.url, { token: blobReadWriteToken });

    console.log('Done Deleting Input File...' + videoUrl.url);
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

// file upload function
const uploadToVercelBlob = async (file) => {
  console.log(file);

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

// getting metadata
function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

module.exports = { videoConversionFunction };
