const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const fs = require('fs');
// const path = require('path');
// const { Console, log } = require('console');

// functions
const functions = require('./functions.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
    methods: ['*'],
  },
});

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
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

// app.post('/refresh-detected', (req, res) => {
//   // deleteProcessedFiles();
//   processedFiles.length = 0;
//   console.log('previous data cleared.');

//   res.status(200).send('Refresh detected. Server state cleared.');
// });

app.post('/convert', async (req, res) => {
  functions.deleteProcessedFiles();

  let inputFile = req.files.videoFile;
  let subtitleFiles = req.files.subtitleFile;
  let selectMenuValues = req.body.selectMenu;
  let startingTime = req.body.StartingTime;
  let endingTime = req.body.EndingTime;
  let resolution = req.body.ResolutionMenu;
  let [widthValue, heightValue] = resolution.split('x');
  let videoCOdec = req.body.videotCodecSelect;
  let aspectRatio = req.body.AspectRatioSelect;
  let qualityConstant;
  if (selectMenuValues !== '.wmv') {
    qualityConstant = req.body.ConstantQualitySelect;
  } else {
    qualityConstant = '';
  }
  let presetValue, tuning, profileValue, levelValue;
  if (selectMenuValues === '.avi' || selectMenuValues === '.flv' || selectMenuValues === '.mkv' || selectMenuValues === '.mov' || selectMenuValues === '.mp4') {
    presetValue = req.body.presetSelect;
    tuning = req.body.tuneSelect;
    profileValue = req.body.profileSelect;
    levelValue = req.body.levelSelect;
  } else {
    presetValue = '';
    tuning = '';
    profileValue = '';
    levelValue = '';
  }

  let fitValue = req.body.fitSelect;
  let framePersecond = req.body.Fps;
  let AudioCodecSelect = req.body.AudioCodec;
  let Channels = req.body.ChannelsSelect;
  let videoVolume = req.body.VolumeSelect;
  let SampleRate = req.body.SampleRateSelect;
  let AudioBitrateValue = req.body.AudioBitrate;
  let imageWatermark = req.files.waterMarkImage;
  let desiredKeyframeInterval = req.body.KeyframeInterval;
  let subtitlesType = req.body.subtitleType;
  let QscaleValue;

  if (selectMenuValues === '.wmv') {
    QscaleValue = req.body.Qscale;
  } else {
    QscaleValue = '';
  }
  QscaleValue = isWMV ? req.body.Qscale : '';

  // subtitles upload
  let subtitlePath = '';
  if (subtitleFiles) {
    functions
      .uploadFile(subtitleFiles, 'temp-files/')
      .then((uploadedFilePath) => {
        subtitlePath = `./${uploadedFilePath}`;
        functions.processedFiles.push(uploadedFilePath);
      })
      .catch((error) => {
        console.log('error uploading file: ' + error);
      });
  }

  // watermarks upload
  let imageWatermarkPath = '';
  if (imageWatermark) {
    functions
      .uploadFile(imageWatermark, 'temp-files/')
      .then((uploadedWatermark) => {
        imageWatermarkPath = `./${uploadedWatermark}`;
        functions.processedFiles.push(uploadedWatermark);
      })
      .catch((error) => {
        console.log('error uploading file: ' + error);
      });
  }

  // uploading input file
  console.log('message', 'File Upload Started');
  inputFile.mv('temp-files/' + inputFile.name, async function (err) {
    if (err) {
      io.emit('message', 'File Upload Error: ' + err.message);
      return res.status(500).send(err);
    } else {
      io.emit('message', 'File Uploaded Successfully.');

      const inputPath = `./temp-files/${inputFile.name}`;
      functions.processedFiles.push(inputPath);
      const lastDotIndex = inputFile.name.lastIndexOf('.');
      const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
      const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;
      functions.processedFiles.push(outputPath);
      let errorMessage = '';
      let hasEmbeddedSubtitles = '';

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
          console.error('FFmpeg stdout:', stdout);
          io.emit('message', 'Conversion Error: ' + err.message);
          res.status(500).send('Conversion Error: ' + err.message);
        });

      try {
        const metadata = await functions.getVideoMetadata(inputPath);
        const totalVideoDurationInSeconds = metadata.format.duration;
        console.log('Video Duration: ', totalVideoDurationInSeconds, 'seconds');
        hasEmbeddedSubtitles = metadata.streams.some((stream) => stream.codec_type === 'subtitle');

        let startingInSeconds = functions.parseTime(startingTime);
        let endingInSeconds = functions.parseTime(endingTime);

        if (startingInSeconds < 0 || endingInSeconds < 0) {
          errorMessage = 'Start and end times must be non-negative values.';
        } else if (startingInSeconds >= endingInSeconds || totalVideoDurationInSeconds <= startingInSeconds || totalVideoDurationInSeconds < endingInSeconds) {
          errorMessage = 'Invalid start or end time.';
          // trimming
        } else if (startingTime && endingTime && endingTime !== '00:00:00') {
          let totalDuration = functions.calculateDuration(startingTime, endingTime);
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
      if (videoCOdec === 'copy') {
        command.videoCodec(videoCOdec);
      } else {
        // videoCodec without 'copy'
        command.videoCodec(videoCOdec);
        let filtersForVideo = [];

        if (resolution !== 'no change') {
          filtersForVideo.push(functions.createComplexVideoFilter(fitValue, widthValue, heightValue, aspectRatio));
        } else if (aspectRatio !== 'no change') {
          filtersForVideo.push(`setdar=${aspectRatio}`);
        }
        // adding all available filters
        if (filtersForVideo.length > 0) {
          const complexFilterExpression = filtersForVideo.join(';');
          command.complexFilter(complexFilterExpression);
        }
        //  tune --> none film animation grain stillimage fastdecode zerolatency psnr ssim
        // video options
        if (tuning && tuning !== 'none' && videoCOdec !== 'flv') {
          const supportedCodecs = ['libvpx', 'libvpx-vp9', 'libaom-av1'];

          if (supportedCodecs.includes(videoCOdec) && !['film', 'animation', 'grain', 'stillimage', 'fastdecode', 'zerolatency'].includes(tuning)) {
            command.addOptions([`-tune ${tuning}`]);
          } else if (videoCOdec === 'libx265' && tuning !== 'stillimage' && tuning !== 'film') {
            command.addOptions([`-tune ${tuning}`]);
          } else if (videoCOdec === 'libx264') {
            command.addOptions([`-tune ${tuning}`]);
          }
        }
        // Profile
        if (profileValue !== '' && profileValue !== 'none' && videoCOdec !== 'libx265' && videoCOdec !== 'libxvid' && videoCOdec !== 'libvpx' && videoCOdec !== 'libvpx-vp9' && videoCOdec !== 'libaom-av1' && videoCOdec !== 'flv') {
          command.addOption(`-profile:v ${profileValue}`);
        }
        // Levels
        if (levelValue !== '' && levelValue !== 'none') {
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
        // Qscale
        if (QscaleValue !== '' && selectMenuValues === '.wmv') {
          command.addOption(`-q:v ${QscaleValue}`);
        }
        // CRF
        if (qualityConstant !== '') {
          command.addOptions([`-crf ${qualityConstant}`]);
        }
        // Preset
        if (presetValue !== '') {
          command.addOptions([`-preset ${presetValue}`]);
        }
      }

      // audio filter chain
      let audioFilterValues = '';
      if (AudioCodecSelect !== 'copy' && AudioCodecSelect !== 'none') {
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

      // Audio Settings
      if (AudioCodecSelect === 'none') {
        command.addOption('-an');
        // command.audioCodec('');
      } else if (AudioCodecSelect === 'copy') {
        command.audioCodec(AudioCodecSelect);
      } else if (AudioCodecSelect !== '') {
        // Audio Codec
        command.audioCodec(AudioCodecSelect);
        // audio Bitrate
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

      // Watermark Handling
      if (imageWatermark) {
        console.log('Image Watermark Path:', imageWatermarkPath);
        command.input(imageWatermarkPath);
        if (resolution === 'no change') {
          console.log('Applying Watermark without Scaling');
          command.complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2`);
        } else {
          console.log('Scaling Watermark and Overlaying');
          command.complexFilter(`[1:v]scale=150:100 [watermark];[0:v][watermark]overlay=(W-w)/2:(H-h)/2`);
        }
      }

      //  Subtitles
      if (subtitlesType !== 'none' && subtitleFiles) {
        console.log(hasEmbeddedSubtitles);
        if (!hasEmbeddedSubtitles) {
          command.input(subtitlePath);
          command.complexFilter(`[0:v]subtitles=${subtitlePath}:force_style='Fontsize=24'[noPriorSubtitles]`);
          command.map('[noPriorSubtitles]');
        } else {
          console.log('Embedded subtitles exist');
          if (subtitlesType === 'soft') {
            command.complexFilter('[0:v][0:s]overlay[soft_v]');
            command.map('[soft_v]');
          } else if (subtitlesType === 'hard') {
            command.complexFilter(`[0:v][0:s]subtitles=${subtitlePath}:force_style='Fontsize=24'[hard_v]`);
            command.map('[hard_v]');
          } else if (subtitlesType === 'copy') {
            command.addOption('-map', '0:s');
          }
        }
      }

      command.save(outputPath);
    }
  });
});

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
