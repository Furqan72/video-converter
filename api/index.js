const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { Console, log } = require('console');
// const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['*'],
  },
});

const AllowedDomains = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);
app.use('/temp-output', express.static('temp-output'));

// deleting all files
function deleteFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      const filePath = path.join(directory, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath, (err) => {
          if (err) throw err;
        });
      } else {
        console.error('File does not exist:', filePath);
      }
    }
  });
}

app.get('/video-converter', (req, res) => {
  res.sendFile(__dirname + '../video-converter/index.html');
});

app.post('/convert', (req, res) => {
  let inputFile = req.files.videoFile;
  let subtitleFiles = req.files.subtitleFile;
  let selectMenuValues = req.body.selectMenu;
  let startingTime = req.body.StartingTime;
  let endingTime = req.body.EndingTime;
  let resolution = req.body.ResolutionMenu;
  let [widthValue, heightValue] = resolution.split('x');
  let videoCOdec = req.body.videotCodecSelect;
  let aspectRatio = req.body.AspectRatioSelect;
  let qualityConstant = req.body.ConstantQualitySelect;
  let presetValue = req.body.presetSelect;
  let tuning = req.body.tuneSelect;
  let profileValue = req.body.profileSelect;
  let levelValue = req.body.levelSelect;
  let fitValue = req.body.fitSelect;
  let framePersecond = req.body.Fps;
  let AudioCodecSelect = req.body.AudioCodec;
  let Channels = req.body.ChannelsSelect;
  let videoVolume = req.body.VolumeSelect;
  let SampleRate = req.body.SampleRateSelect;
  let AudioBitrateValue = req.body.AudioBitrate;
  let imageWatermark = req.files.waterMarkImage;
  // console.log(imageWatermark);
  let desiredKeyframeInterval = req.body.KeyframeInterval;
  let subtitlesType = req.body.subtitleType;

  deleteFilesInDirectory('./temp-files/');
  deleteFilesInDirectory('./temp-output/');

  // subtitle upload
  let subtitlePath = '';
  if (subtitleFiles) {
    subtitleFiles.mv('temp-files/' + subtitleFiles.name, function (err) {
      if (err) {
        console.error('Subtitle File Upload Error:', err);
        io.emit('message', 'Subtitle File Upload Error: ' + err.message);
        return;
      } else {
        io.emit('message', 'Subtitle File Uploaded Successfully.');

        subtitlePath = `./temp-files/${subtitleFiles.name}`;
      }
    });
  }

  // watermarks upload
  let imageWatermarkPath = '';
  if (imageWatermark) {
    imageWatermark.mv('temp-files/' + imageWatermark.name, function (err) {
      if (err) {
        console.error('Subtitle File Upload Error:', err);
        io.emit('message', 'Subtitle File Upload Error: ' + err.message);
        return;
      } else {
        io.emit('message', 'Subtitle File Uploaded Successfully.');

        imageWatermarkPath = `./temp-files/${imageWatermark.name}`;
      }
    });
  }

  // uploading input file
  io.emit('message', 'File Upload Started');
  inputFile.mv('temp-files/' + inputFile.name, async function (err) {
    if (err) {
      io.emit('message', 'File Upload Error: ' + err.message);
      return res.status(500).send(err);
    } else {
      io.emit('message', 'File Uploaded Successfully.');

      const inputPath = `./temp-files/${inputFile.name}`;
      const lastDotIndex = inputFile.name.lastIndexOf('.');
      const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
      const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
      let errorMessage = '';

      // audio filter chain
      let audioFilterValues = '';
      if (AudioCodecSelect !== 'copy') {
        if (videoVolume !== '') {
          audioFilterValues += `volume=${videoVolume},`;
        }
        if (SampleRate !== '') {
          audioFilterValues += `asetrate=${SampleRate},`;
        }
        if (audioFilterValues !== '') {
          audioFilterValues = audioFilterValues.slice(0, -1);
        }
      }

      const command = new ffmpeg(inputPath)
        // covnersion start
        .on('start', () => {
          io.emit('message', 'Conversion Started.');
        })
        // covnersion in progress
        .on('progress', (progress) => {
          if (progress.percent !== undefined) {
            const progressPercent = progress.percent.toFixed(2);
            io.emit('progress', progressPercent);
          }
        })
        // covnersion end
        .on('end', () => {
          progressPercent = 100;
          io.emit('progress', progressPercent);
          io.emit('message', 'Conversion Finished.');
        })
        // covnersion error
        .on('error', (err, stdout, stderr) => {
          console.error('Error:', err);
          console.error('FFmpeg stderr:', stderr);
          io.emit('message', 'Conversion Error: ' + err.message);
          res.status(500).send('Conversion Error: ' + err.message);
        });

      try {
        const metadata = await getVideoMetadata(inputPath);
        const totalVideoDurationInSeconds = metadata.format.duration;
        console.log('Video Duration: ', totalVideoDurationInSeconds, 'seconds');

        let startingInSeconds = parseTime(startingTime);
        let endingInSeconds = parseTime(endingTime);

        if (startingInSeconds < 0 || endingInSeconds < 0) {
          errorMessage = 'Start and end times must be non-negative values.';
        } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
          errorMessage = 'Invalid start or end time.';
          // trimming
        } else if (startingTime && endingTime && endingTime !== '00:00:00') {
          let totalDuration = calculateDuration(startingTime, endingTime);
          command.setStartTime(startingTime);
          command.setDuration(totalDuration);
        }
      } catch (err) {
        console.log('not working');
        errorMessage = 'Error retrieving video metadata.';
      }

      res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues, message: errorMessage });

      if (errorMessage !== '') {
        return;
      }
      // videoCodec with 'copy'   =>  no other filters work with 'copy' as it encodes according to the previous settings of the video
      if (videoCOdec === 'copy' || selectMenuValues === 'wmv') {
        command.videoCodec('copy');
      } else {
        // videoCodec without 'copy'
        command.videoCodec(videoCOdec);
        let filtersForVideo = [];

        if (resolution !== 'no change') {
          filtersForVideo.push(createComplexVideoFilter(fitValue, widthValue, heightValue));

          if (aspectRatio !== 'no change') {
            filtersForVideo.push(`setdar=${aspectRatio}`);
          }
        } else if (aspectRatio !== 'no change') {
          filtersForVideo.push(`setdar=${aspectRatio}`);
        }

        if (filtersForVideo.length > 0) {
          const complexFilterExpression = filtersForVideo.join(';');
          command.complexFilter(complexFilterExpression);
        }
        // let filtersForVideo = [];

        // if (resolution !== 'no change') {
        //   filtersForVideo.push(createVideoFilters(fitValue, widthValue, heightValue));

        //   if (aspectRatio !== 'no change') {
        //     filtersForVideo.push(`setdar=${aspectRatio}`);
        //   }
        // } else if (aspectRatio !== 'no change') {
        //   filtersForVideo.push(`setdar=${aspectRatio}`);
        // }
        // if (filtersForVideo.length > 0) {
        //   command.complexFilter(filtersForVideo);
        //   // command.videoFilters(`${filtersForVideo.join(',')}`);
        // }
        // video options
        if (tuning !== 'none') {
          command.addOptions([`-tune ${tuning}`]);
        }
        // Profile
        if (profileValue !== 'none') {
          command.addOptions([`-profile:v ${profileValue}`]);
        }
        // Levels
        if (levelValue !== 'none') {
          command.addOptions([`-level ${levelValue}`]);
        }
        // FPS
        if (framePersecond !== '') {
          command.addOption(`-r ${framePersecond}`);
        }
        // Key Frame Interval
        if (desiredKeyframeInterval !== '') {
          command.addOption(`-g ${desiredKeyframeInterval}`);
        }
        // CRF
        command.addOptions([`-crf ${qualityConstant}`]);
        // Preset
        command.addOptions([`-preset ${presetValue}`]);
      }

      // Audio Settings
      if (AudioCodecSelect === 'copy') {
        command.audioCodec('copy');
      } else if (AudioCodecSelect !== '') {
        // Audio Codec
        command.audioCodec(AudioCodecSelect);
        // audioBitrate
        if (AudioBitrateValue !== '') {
          command.audioBitrate(`${AudioBitrateValue}`);
        }
        // audio channels
        if (Channels !== '') {
          command.audioChannels(`${Channels}`);
        }
        if (audioFilterValues.length > 0) {
          command.audioFilter(`${audioFilterValues}`);
        }
      }

      // Subtitles
      if (subtitlesType !== 'none' && subtitleFiles) {
        let complexFilter = [];
        if (subtitlesType === 'soft') {
          complexFilter.push(`[0:v][0:s]overlay[v]`);
        } else if (subtitlesType === 'hard') {
          complexFilter.push(`[0:v][0:s]subtitles=${subtitlePath}:force_style='Fontsize=24'[v]`);
        }
        complexFilter.push('-map "[v]"');

        command.complexFilter(complexFilter);
      }
      // Watermark Handling
      if (imageWatermark) {
        let watermarkFilter = '';
        if (resolution === 'no change') {
          watermarkFilter = `[0:v][1:v]overlay=(W-w)/2:(H-h)/2[out]`;
        } else {
          // watermarkFilter = `[0:v][1:v]scale=${widthValue}:${heightValue}[watermark];[watermark]overlay=(W-w)/2:(H-h)/2[out]`;
          watermarkFilter = `[1:v]scale=960:720[watermark];[0:v][watermark]overlay=(W-w)/2:(H-h)/2[out]`;
        }

        command.input(imageWatermarkPath);
        command.complexFilter(watermarkFilter, 'out', { map: '[out]' });
      }
      command.save(outputPath);
    }
  });
});

// getting video metadata
function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// converting HH:MM:SS to Seconds
function parseTime(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// calculating end-time
function calculateDuration(startTime, endTime) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const durationInSeconds = end - start;
  return formatTime(durationInSeconds);
}

// returning the time in the format => HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes}:${remainingSeconds}`;
}

// checking values for Fit (in video options)
function createComplexVideoFilter(fitValue, widthValue, heightValue) {
  let complexFilter = [];

  switch (fitValue) {
    case 'scale':
      complexFilter.push(`scale=${widthValue}:${heightValue}`);
      break;
    case 'max':
      complexFilter.push(`scale=w=min(iw\\,${widthValue}):h=min(ih\\,${heightValue}):force_original_aspect_ratio=decrease`);
      break;
    case 'pad':
      complexFilter.push(`scale=${widthValue}:${heightValue}:force_original_aspect_ratio=decrease`);
      complexFilter.push(`pad=${widthValue}:${heightValue}:(ow-iw)/2:(oh-ih)/2`);
      break;
    case 'crop':
      complexFilter.push(`crop=${widthValue}:${heightValue}`);
      break;
    default:
      break;
  }

  return complexFilter;
}

// function createVideoFilters(fitValue, widthValue, heightValue) {
//   let filter = '';
//   switch (fitValue) {
//     case 'scale':
//       filter = `scale=${widthValue}:${heightValue}`;
//       break;
//     case 'max':
//       filter = `scale=w=min(iw\\,${widthValue}):h=min(ih\\,${heightValue}):force_original_aspect_ratio=decrease`;
//       break;
//     case 'pad':
//       filter = `scale=${widthValue}:${heightValue}:force_original_aspect_ratio=decrease,pad=${widthValue}:${heightValue}:(ow-iw)/2:(oh-ih)/2`;
//       break;
//     case 'crop':
//       filter = `crop=${widthValue}:${heightValue}`;
//       break;
//     default:
//       break;
//   }
//   return filter;
// }

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
