const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

// const path = '/ffmpeg-6.1-amd64-static/ffmpeg.exe';
fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

const app = express();
const server = http.createServer(app);

const AllowedDomains = {
  origin: ['localhost:5173', 'video-converter2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: './temp-files/',
//   })
// );
// app.use('/temp-output', express.static('temp-output'));

// const upload = multer().single('uploadFile');
const upload = multer().fields([
  { name: 'uploadFile', maxCount: 1 },
  { name: 'subtitleFile', maxCount: 1 },
  { name: 'waterMarkImage', maxCount: 1 },
]);
app.use(upload);

app.get('/', (req, res) => {
  res.status(200).send('Default');
});

// Extracting Options From Request
const notincludevalues = '';
function extractOptionsFromRequest(req) {
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
// file download
async function downloadVideo(url) {
  const response = await fetch(url);
  const videoStream = await response.body;
  return videoStream;
}

app.post('/convert', async (req, res) => {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);
    // console.log(options);

    const videoUrl = await uploadToVercelBlob(options.inputFile);
    console.log('Uploaded Input File >> ' + videoUrl.url);

    // const videoStream = await downloadVideo(videoUrl.url);
    console.log('downloaded.....');

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
    // command.pipeto

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
        res.json({ downloadUrl: convertedBlob.url, filedeleted: videoUrl.url, metadata: 'jsonData', errorMessage: '' });
      } catch (error) {
        console.error(error);
        res.json({ downloadUrl: 'covnertedFile', filedeleted: 'videoUrl.url', metadata: 'jsonData', errorMessage: '' });
      } finally {
        fs.unlinkSync(tmpOutputPath);
      }
    });

    // await new Promise((resolve, reject) => {
    //   command.on('end', resolve).on('error', reject);
    // });
    // let jsonData;
    console.log('process end');
    // res.json({ downloadUrl: covnertedFile, filedeleted: videoUrl.url, metadata: 'jsonData', errorMessage: '' });
  } catch (error) {
    console.log(error);
    res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
  }
});

server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
