const fluentFfmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');
const { PassThrough } = require('stream');

fluentFfmpeg.setFfprobePath(ffprobeStatic);
fluentFfmpeg.setFfmpegPath(ffmpegPath);

// vercel token
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

// functions
const functions = require('../functions/functions');

const handleError = (message, error) => {
  console.error(message, error || '');
  // res.json;
};

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

// uploading to vercel blob
const uploadToVercelBlob = async (file) => {
  try {
    return await put(file[0].originalname, file[0].buffer, {
      access: 'public',
      contentType: file[0].mimetype,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.log(error);
  }
};

// Metadata of the video
function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    fluentFfmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.log('error in metadata');
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// Trimming
const configureTrimming = (command, options, metadata) => {
  try {
    const totalVideoDurationInSeconds = metadata.format.duration;
    console.log(totalVideoDurationInSeconds);
    const startingInSeconds = functions.parseTime(options.startingTime);
    const endingInSeconds = functions.parseTime(options.endingTime);

    if (startingInSeconds < 0 || endingInSeconds < 0) {
      handleError('Start and end times must be non-negative values.');
    } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
      handleError(`Invalid start or end time. The duration of this video is ${totalVideoDurationInSeconds} seconds.`);
    } else if (options.startingTime && options.endingTime && options.endingTime !== '00:00:00') {
      const formattedTotalDuration = functions.formatTime(totalVideoDurationInSeconds);
      const requiredDuration = functions.calculateDuration(options.startingTime, options.endingTime);

      command.seekInput(options.startingTime || `00:00:00`);
      command.duration(requiredDuration || formattedTotalDuration);
    }
  } catch (err) {
    console.log(err);
  }
};

// Video Conversion FFmepg events
const configureFFmpegEvents = (command) => {
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

        console.log('message', extractedText + ' Conversion failed!!');
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

// Video Configuration
const configureVideoConversion = (command, options, videoMetadata) => {
  try {
    const originalWidth = videoMetadata.streams[0].width;
    const originalHeight = videoMetadata.streams[0].height;

    command.addOption('-progress', '-');

    // console.log(videoMetadata.streams[0]);
    console.log(`Video resolution ORIGINAL DIMENSIONS: ${originalWidth}x${originalHeight}`);

    let filtersForVideo = [];
    const [width, height] = options.resolution.split('x');

    if (options.videoCOdec === 'copy') {
      command.videoCodec(options.videoCOdec);
    } else {
      command.videoCodec(options.videoCOdec);

      if (options.resolution === 'no change') {
        filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, originalWidth, originalHeight, options.aspectRatio));
        console.log(`Video resolution ORIGINAL DIMENSIONS (condition working === 'no change'): ${originalWidth}x${originalHeight}`);
      } else {
        filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, width, height, options.aspectRatio));
      }

      const complexFilterExpression = filtersForVideo.flat().join(';');
      if (complexFilterExpression) {
        command.complexFilter(complexFilterExpression);
      }

      // CRF
      if (options.qualityConstant) command.addOptions([`-crf ${options.qualityConstant}`]);
      // Tune
      if (options.tuning && options.tuning !== 'none') command.addOptions([`-tune ${options.tuning}`]);
      // Profile
      if (options.profileValue && options.profileValue !== 'none') command.addOption(`-profile:v ${options.profileValue}`);
      // Levels
      if (options.levelValue && options.levelValue !== 'none') command.addOptions([`-level ${options.levelValue}`]);
      // Preset
      if (options.presetValue) command.addOptions([`-preset ${options.presetValue}`]);
      // Qscale
      if (options.QscaleValue && options.selectMenuValues === '.wmv') command.addOption(`-q:v ${options.QscaleValue}`);
      // FPS
      if (options.framePersecond) command.addOption('-r', options.framePersecond);
      // Key Frame Interval
      if (options.desiredKeyframeInterval) command.addOption(`-g ${options.desiredKeyframeInterval}`);
      // buffer-size and max-bitrate
      const { buffer_size, max_bitrate } = videoMetadata.streams[0];
      if (buffer_size && max_bitrate) {
        command.addOptions([`-bufsize ${buffer_size}`, `-maxrate ${max_bitrate}`]);
      }
    }
  } catch (err) {
    handleError('Error configuring video conversion:', err);
  }
};

// Audio Configuration
const configureAudioConversion = (command, options) => {
  try {
    command.addOption('-progress', '-');

    if (options.AudioCodecSelect === 'none') {
      command.addOption('-an'); // Disable audio
    } else if (options.AudioCodecSelect === 'copy') {
      command.audioCodec(options.AudioCodecSelect); // Copy audio stream
    } else if (options.AudioCodecSelect) {
      // If not empty then 'Audio Codec'
      command.audioCodec(options.AudioCodecSelect);

      // Audio Bitrate
      if (options.AudioBitrateValue !== '') {
        command.audioBitrate(options.AudioBitrateValue);
      }
      // Audio Channels
      if (options.Channels !== '') {
        command.audioChannels(options.Channels);
      }
      // Audio Volume and Sample Rate
      let audioFilterValues = [];
      if (options.videoVolume !== '') {
        audioFilterValues.push(`volume=${options.videoVolume}`);
      }
      if (options.SampleRate !== '') {
        audioFilterValues.push(`asetrate=${options.SampleRate}`);
      }
      if (audioFilterValues.length > 0) {
        command.audioFilter(audioFilterValues.join(','));
      }
    }
  } catch (err) {
    console.log('Error configuring audio conversion:', err);
    handleError('Error configuring audio conversion:', err);
  }
};

// video conversion function
const videoConversionFunction = async (req, res) => {
  try {
    console.log('Process Start....');
    const editingoptions = extractOptionsFromRequest(req);
    const withoutDotSelectMenu = editingoptions.selectMenuValues.slice(1);
    const withoutDotFileName = editingoptions.inputFile[0].originalname.split('.');
    console.log(withoutDotFileName[0]);

    const videoUrl = await uploadToVercelBlob(req.files.uploadFile);
    console.log('Done Uploading... ' + videoUrl.url);
    const downloadUrl = videoUrl.url;

    // uploading watermark & subtitle
    let subtitleResponse, watermarkResponse;
    const [watermarkUrl] = editingoptions.imageWatermark ? await Promise.all([uploadToVercelBlob(req.files.waterMarkImage)]) : '';
    const [subtitleUrl] = editingoptions.subtitleFiles ? await Promise.all([uploadToVercelBlob(req.files.subtitleFile)]) : '';
    if (editingoptions.waterMarkImage) {
      console.log('WaterMark Image Uploaded...' + subtitleUrl.url);
    }
    if (editingoptions.subtitleFiles) {
      console.log('Subtitles File Uploaded...' + watermarkUrl.url);
    }

    const videoResponse = await fetch(downloadUrl);
    console.log('Done Downloading...');

    const videoMetadata = await getVideoMetadata(downloadUrl);
    console.log('Done Getting Metadata...');
    // console.log(videoMetadata);

    const videoStream = await videoResponse.body;
    const outputStream = new PassThrough();

    const command = new fluentFfmpeg();
    command.input(videoStream);
    command.format(withoutDotSelectMenu);

    // trimming
    configureTrimming(command, editingoptions, videoMetadata);
    const errorMessages = '';

    configureFFmpegEvents(command);

    // Video Configuration
    configureVideoConversion(command, editingoptions, videoMetadata);

    // Audio Configuration
    configureAudioConversion(command, editingoptions);

    command.pipe(outputStream);
    console.log('Done Conversion...');

    const processedVideo = await put(`${withoutDotFileName}${editingoptions.selectMenuValues}`, outputStream, {
      access: 'public',
      contentType: `video/${editingoptions.selectMenuValues}`,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });

    console.log('Done Re-Uploading...' + processedVideo.url);
    // await del(videoUrl.url, { token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN });
    // if (subtitleUrl) {
    //   await del(subtitleUrl.url, { token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN });
    // }
    // if (watermarkUrl) {
    //   await del(watermarkUrl.url, { token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN });
    // }
    res.json({ downloadUrl: processedVideo.url, filedeleted: 'downloadUrl', metadata: videoMetadata, errorMessage: errorMessages || '' });

    console.log('Done Deleting Input File...' + 'videoUrl.url' + 'subtitile.url' + 'watermark.url');
  } catch (error) {
    handleError('Error in videoConversionFunction:', error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

module.exports = { videoConversionFunction };
