const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');

// functions
const functions = require('../functions/functions');

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
  const options = {};

  options.inputFile = req.files.videoFile;
  console.log(options.inputFile);
  options.subtitleFiles = req.files.subtitleFile;
  options.selectMenuValues = req.body.selectMenu;
  options.selectForFile = req.body.ConvertFromSelect;
  options.startingTime = req.body.StartingTime;
  options.endingTime = req.body.EndingTime;
  options.resolution = req.body.ResolutionMenu;
  //   resolution err
  options.videoCOdec = req.body.videotCodecSelect;
  options.aspectRatio = req.body.AspectRatioSelect;

  //   let resolution = req.body.ResolutionMenu;
  // values when not to include
  const selectedvaluesincluded = ['.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.m4v', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm'];
  const notincludevalues = selectedvaluesincluded.some((format) => options.selectMenuValues.includes(format));

  options.qualityConstant = !notincludevalues ? req.body.ConstantQualitySelect : '';
  options.presetValue = !notincludevalues ? req.body.presetSelect : '';
  options.tuning = !notincludevalues ? req.body.tuneSelect : '';
  options.profileValue = !notincludevalues ? req.body.profileSelect : '';
  options.levelValue = !notincludevalues ? req.body.levelSelect : '';

  options.fitValue = req.body.fitSelect;
  options.framePersecond = req.body.fpsSelect;
  options.AudioCodecSelect = req.body.AudioCodec;
  options.Channels = req.body.ChannelsSelect;
  options.videoVolume = req.body.VolumeSelect;
  options.SampleRate = req.body.SampleRateSelect;
  options.AudioBitrateValue = req.body.BitrateValuesSelect;
  options.imageWatermark = req.files.waterMarkImage;
  options.desiredKeyframeInterval = req.body.KeyframeInterval;
  options.subtitlesType = req.body.subtitleType;
  options.QscaleValue = options.selectMenuValues === '.wmv' ? req.body.Qscale : '';
  // console.log(options);

  return options;
};

// Define a function to handle file uploads and return a Promise
// check for file uploading
const handleFileUpload = (file, destination, processedFiles) => {
  return new Promise((resolve, reject) => {
    functions
      .uploadFile(file, destination)
      .then((uploadedFilePath) => {
        processedFiles.push(uploadedFilePath);
        resolve(uploadedFilePath);
        console.log('file uploaded successfully.' + processedFiles);
      })
      .catch((error) => {
        console.log('Error uploading file: ' + error);
        reject(error);
      });
  });
};

// Video Conversion FFmepg events
const configureFFmpegEvents = (command, io, res) => {
  command
    .on('start', () => {
      console.log('message', 'Conversion Started.');
    })
    .on('progress', (progress) => {
      if (progress.percent !== undefined) {
        const progressPercent = progress.percent.toFixed(2);
        io.emit('progress', progressPercent);
        console.log(progressPercent);
      }
    })
    .on('end', () => {
      const progressPercent = 100;
      io.emit('progress', progressPercent);
      console.log('message', 'Conversion Finished.');
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('Error:', err);
        console.error('FFmpeg stderr:', stderr);
        console.error('FFmpeg stdout:', stdout);

        const errorLines = stderr.split('\n');
        const errorPatterns = /(Could not find|width not|compatible|Unsupported codec|width must be|Only VP8 or VP9 or AV1|Streamcopy|Unable to find|encoder setup failed|does not yet support|can only be written|only supports|is not available|codec tag found for|only supported in|codec failed|is not supported in|Packet is missing PTS|at most one|Error setting option profile|Possible tunes: psnr ssim grain|Error setting option tune to| Unsupported audio codec. Must be one of )/;
        const errorMessages = errorLines.filter((line) => errorPatterns.test(line));

        let extractedText = '';
        errorMessages.forEach((errorMessage) => {
          const indexOfClosingBracket = errorMessage.indexOf(']');
          if (indexOfClosingBracket !== -1) {
            extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
          }
        });
        console.log('Error  -----------  ', extractedText);

        io.emit('message', extractedText + ' Conversion failed!!');
        res.status(500).send('Conversion Error: ' + err.message);
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

// Video Configuration
const configureVideoConversion = (command, options, originalDimensions) => {
  console.log(`Video resolution ORGINAL DIMENSIONS : ${originalDimensions.width}x${originalDimensions.height}`);

  // covnerting dimensions to even
  const originalWidth = parseInt(Math.ceil(originalDimensions.width / 2) * 2);
  const originalHeight = parseInt(Math.ceil(originalDimensions.height / 2) * 2);
  console.log(`Video resolution ORGINAL DIMENSIONS (EVEN-Number) : ${originalWidth}x${originalHeight}`);

  let filtersForVideo = [];
  let [width, height] = options.resolution.split('x');

  // copy-codec
  if (options.videoCOdec === 'copy') {
    command.videoCodec(options.videoCOdec);

    // videoCodec without 'copy' . using codec other than copy
  } else {
    command.videoCodec(options.videoCOdec);
    // resolution
    if (options.resolution !== 'no change') {
      filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, width, height, options.aspectRatio));
    } else if (options.resolution === 'no change') {
      filtersForVideo.push(functions.createComplexVideoFilter(options.fitValue, originalDimensions.width, originalDimensions.height, options.aspectRatio));
    }
    if (filtersForVideo.length > 0) {
      const complexFilterExpression = filtersForVideo.join(';');
      command.complexFilter(complexFilterExpression);
    }
    // CRF
    if (options.qualityConstant) {
      command.addOptions([`-crf ${options.qualityConstant}`]);
    }
    // Tune
    if (options.tuning && options.tuning !== 'none') {
      command.addOptions([`-tune ${options.tuning}`]);
    }
    // Profile
    if (options.profileValue && options.profileValue !== 'none') {
      command.addOption(`-profile:v ${options.profileValue}`);
    }
    // Levels
    if (options.levelValue && options.levelValue !== 'none') {
      command.addOptions([`-level ${options.levelValue}`]);
    }
    // Preset
    if (options.presetValue) {
      command.addOptions([`-preset ${options.presetValue}`]);
    }
    // Qscale
    if (options.QscaleValue && options.selectMenuValues === '.wmv') {
      command.addOption(`-q:v ${options.QscaleValue}`);
    }
    // FPS
    if (options.framePersecond) {
      command.addOption('-r', options.framePersecond);
    }
    // Key Frame Interval
    if (options.desiredKeyframeInterval) {
      command.addOption(`-g ${options.desiredKeyframeInterval}`);
    }
    // buffer-size and max-bitrate
    if (originalDimensions.buffer_size && originalDimensions.max_bitrate) {
      command.addOptions([`-bufsize ${originalDimensions.buffer_size}`]);
      command.addOptions([`-maxrate ${originalDimensions.max_bitrate}`]);
    }
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
const configureTrimming = async (command, options, path) => {
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
    errorMessages = 'Error retrieving video metadata. Please try again or upload another video.';
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

// video conversion function
const videoConversionFunction = async (req, res, io) => {
  // deleting previous files
  functions.deleteProcessedFiles();

  // values from the from
  const editingoptions = extractOptionsFromRequest(req);
  try {
    // Upload  Subtitles | Watermark
    const subtitlePath = editingoptions.subtitleFiles ? await handleFileUpload(editingoptions.subtitleFiles, 'temp-files/', functions.processedFiles) : '';
    const imageWatermarkPath = editingoptions.imageWatermark ? await handleFileUpload(editingoptions.imageWatermark, 'temp-files/', functions.processedFiles) : '';
    // Upload input file (video)
    const inputPath = await handleFileUpload(editingoptions.inputFile, 'temp-files/', functions.processedFiles);

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    functions.processedFiles.push(outputPath);
    // let errorMessage = '';
    let hasEmbeddedSubtitles = '';

    const command = new ffmpeg(inputPath);

    // FFmpeg --> start,progress,end,error
    configureFFmpegEvents(command, io, res);

    // Trimming Configuration
    const { errorMessages, checkSubtitles, videoStream, completeData } = await configureTrimming(command, editingoptions, inputPath);
    res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData });

    // Inside the configureVideoConversion function

    // checking for multiple video streams
    if (editingoptions.selectMenuValues === '.flv' || editingoptions.selectMenuValues === '.mkv') {
      if (videoStream && videoStream.length > 1) {
        command.inputOptions(['-map 0:v:0']);
      }
    }

    //
    // error
    if (errorMessages !== '') {
      console.log('Error while trimming the video..........' + errorMessages);
      io.emit('error', errorMessages);
      return;
    }
    hasEmbeddedSubtitles = checkSubtitles;
    console.log(hasEmbeddedSubtitles);

    // Video Settings
    configureVideoConversion(command, editingoptions, videoStream);

    // Audio Settings
    configureAudioConversion(command, editingoptions);

    // Watermark Handling
    configurewaterMark(command, editingoptions, imageWatermarkPath);

    //  Subtitles
    configureSubtitles(command, editingoptions, subtitlePath, hasEmbeddedSubtitles);

    // if (editingoptions.selectMenuValues === '.mkv') {
    //   command.addInputOptions('-fflags +genpts');
    //   command.inputOption('-copyts'); // Copy timestamps
    // }

    if (editingoptions.selectMenuValues !== '.flv' && editingoptions.selectMenuValues !== '.mkv') {
      command.outputOptions(['-map 0', '-dn']);
    }

    // console.log('FFmpeg Command:', command.toString()); // log for everything
    // command.inputOptions('-loglevel debug');
    command.save(outputPath);

    // Handle any unexpected errors
  } catch (error) {
    console.error('An error occurred in the last try catch:', error);
    res.status(500).send('An error occurred during video conversion.');
  }
};

module.exports = { videoConversionFunction };
