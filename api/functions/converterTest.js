const fs = require('fs');
const { put, del } = require('@vercel/blob');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);
// const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_8oL0c4E3y4emK5Iq_mNmffcqTL3VgnPvoTKAxDK3jiN3PvD';
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_Wy9muWy4jkmOzgGe_Iea1GKPgVKTIJFJdw6JYTFxVNjEJhW';

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
  console.log(options);

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
const configureFFmpegEvents = (command, res, tmpOutputPath, fileNameIwthoutExtension, selectMenuValues, selectedValues, completeVideoMetadata) => {
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
        res.json({ downloadUrl: convertedBlob.url, fileName: fileNameIwthoutExtension + selectMenuValues, metadata: completeVideoMetadata, errorMessage: '' });
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

        // const finalMessage = !extractedText ? '-----' : extractedText;
        // res.status(500).send('Conversion Error: ' + err.message);
        res.json({ downloadUrl: '', fileName: '', metadata: '', errorMessage: extractedText });
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

// Applying resolution normally (with and without filters)
const resolutionConfigureSettings = (fitValue, resolution, watermarkCheck) => {
  const [givenWidth, givenHeight] = resolution.split('x');
  console.log(givenWidth, givenHeight);
  let resolutionDimensions;

  if (fitValue === 'scale') {
    resolutionDimensions = watermarkCheck ? `[0:v]scale=w=${givenWidth}:h=${givenHeight}[resolution]` : `scale=${givenWidth}:${givenHeight}`;
  } else if (fitValue === 'max') {
    resolutionDimensions = watermarkCheck ? `[0:v]scale=w=min(iw\\,${givenWidth}):h=min(ih\\,${givenHeight}):force_original_aspect_ratio=decrease[resolution]` : `scale=w=min(iw\\,${givenWidth}):h=min(ih\\,${givenHeight}):force_original_aspect_ratio=decrease`;
  } else if (fitValue === 'pad') {
    resolutionDimensions = watermarkCheck ? `[0:v]pad=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2[resolution]` : `scale=w=${givenWidth}:h=${givenHeight},pad=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2`;
  } else if (fitValue === 'crop') {
    resolutionDimensions = watermarkCheck ? `[0:v]scale=w=${givenWidth}:h=${givenHeight},crop=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2[resolution]` : `scale=w=${givenWidth}:h=${givenHeight},crop=${givenWidth}:${givenHeight}:(ow-iw)/2:(oh-ih)/2`;
  }

  let watermarkConfig = '[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]';
  let watermarkPosition = '[resolution][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2';

  return watermarkCheck ? [resolutionDimensions, watermarkConfig, watermarkPosition] : resolutionDimensions;
};

// Video Configuration
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

// Subtitles
const configureSubtitleSettings = (command, options, path) => {
  if (options.subtitlesType === 'soft' || options.subtitlesType === 'hard') {
    command.outputOption('-c:s ass');
    // } else if (options.subtitlesType === 'hard') {
    // const subtitlesFilter = `[0:v][0:s]subtitles=${path}[v]`;
    // command.complexFilter(subtitlesFilter);
    // command.map('[v]');
  } else if (options.subtitlesType === 'copy') {
    command.addOption('-map', '0:s');
  }
};

// WaterMark
const configureWatermarkSettings = (command) => {
  command.complexFilter(['[1:v]format=rgba,colorchannelmixer=aa=0.8[watermark]', '[0:v][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2']);
};

// checking the link for the file
function logFileUploads(videoUrl, subtitleUrl, watermarkUrl) {
  console.log('Uploaded Input File >>', videoUrl.url);
  if (subtitleUrl) {
    console.log('Uploaded Subtitle File >>', subtitleUrl.url);
  }
  if (watermarkUrl) {
    console.log('Uploaded Watermark File >>', watermarkUrl.url);
  }
}

// removing and adding extensions from the file, setting up trimming and path for the output path for converted file
function prepareConversionData(options, completeVideoMetadata) {
  const fileName = options.inputFile[0].originalname.split('.');
  const fileNameWithoutExtension = fileName[0];
  console.log(fileNameWithoutExtension);

  const tmpOutputPath = `/tmp/converted-${fileNameWithoutExtension}${options.selectMenuValues}`;
  const selectedValues = options.selectMenuValues.slice(1);

  let requiredDuration;
  if (options.startingTime && options.endingTime) {
    requiredDuration = configureTrimming(options.startingTime, options.endingTime, completeVideoMetadata.format.duration);
  }

  return { fileNameWithoutExtension, tmpOutputPath, selectedValues, requiredDuration };
}

// processing video
function createFFmpegCommand(res, videoUrl, subtitleUrl, watermarkUrl, options, fileNameWithoutExtension, tmpOutputPath, selectedValues, requiredDuration, completeVideoMetadata) {
  let watermarkCheck;
  const command = new fluentFfmpeg();
  command.input(videoUrl);

  configureFFmpegEvents(command, res, tmpOutputPath, fileNameWithoutExtension, options.selectMenuValues, selectedValues, completeVideoMetadata);

  if (requiredDuration) {
    command.setStartTime(options.startingTime);
    command.setDuration(requiredDuration.totalDuration);
  }

  if (subtitleUrl) {
    command.input(subtitleUrl.url);
  }

  if (watermarkUrl) {
    command.input(watermarkUrl.url);
  }

  command.videoCodec(options.videoCOdec);

  if (options.videoCOdec !== 'copy') {
    configureVideoSettings(command, options, completeVideoMetadata);
  }

  configureAudioSettings(command, options);

  // watermark
  if (options.imageWatermark && options.resolution === 'no change') {
    configureWatermarkSettings(command, options, watermarkUrl.url);

    // watermark && resolution
  } else if (options.imageWatermark && options.resolution !== 'no change') {
    console.log(resolutionConfigureSettings(options.fitValue, options.resolution, (watermarkCheck = true)));
    command.complexFilter(resolutionConfigureSettings(options.fitValue, options.resolution, (watermarkCheck = true)));

    // resolution
  } else if (options.resolution !== 'no change') {
    command.complexFilter(resolutionConfigureSettings(options.fitValue, options.resolution, (watermarkCheck = false)));
  }

  if (subtitleUrl) {
    configureSubtitleSettings(command, options, subtitleUrl.url);
  }

  if (options.selectMenuValues !== '.flv' && options.selectMenuValues !== '.mkv') {
    command.outputOptions(['-map 0', '-dn']);
  }

  command.save(tmpOutputPath);
}

// Function
async function videoConversionFunction(req, res) {
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
    console.log('Uploading Files.....');

    // metadata
    const completeVideoMetadata = await videoMetadata(videoUrl.url);
    console.log('Metadata.....');

    // checking the link for the file
    logFileUploads(videoUrl, subtitleUrl, watermarkUrl);

    const videoStream = completeVideoMetadata.streams.find((stream) => stream.codec_type === 'video');
    const { fileNameWithoutExtension, tmpOutputPath, selectedValues, requiredDuration } = prepareConversionData(options, completeVideoMetadata);
    // console.log('<fileNameWithoutExtension:>', fileNameWithoutExtension, ' <tmpOutputPath:>', tmpOutputPath, ' <selectedValues:>', selectedValues, ' <requiredDuration :>', requiredDuration);

    createFFmpegCommand(res, videoUrl.url, subtitleUrl, watermarkUrl, options, fileNameWithoutExtension, tmpOutputPath, selectedValues, requiredDuration, completeVideoMetadata);

    console.log('process end');
  } catch (error) {
    console.log(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
}

module.exports = { videoConversionFunction };
