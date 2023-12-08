/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressMultipartFileParser = require('express-multipart-file-parser');
const multer = require('multer');
const fs = require('fs');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

// const path = '/ffmpeg-6.1-amd64-static/ffmpeg.exe';
// console.log(ffmpegPath);
// fluentFfmpeg.setFfmpegPath('./ffmpeg/ffmpeg.exe');

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);

// firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Initialize Firebase Admin SDK
const firebaseConfig = {
  apiKey: 'AIzaSyBQ45jGnuiDAG60udTdxq95JCPcpXS-OQQ',
  authDomain: 'converter-tools-2f30a.firebaseapp.com',
  projectId: 'converter-tools-2f30a',
  storageBucket: 'converter-tools-2f30a.appspot.com',
  messagingSenderId: '1089779141360',
  appId: '1:1089779141360:web:e853a2d19610e589c91035',
};

const adminApp = initializeApp(firebaseConfig);
const db = getFirestore(adminApp);
// const storage = getStorage(adminApp);
const app = express();

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://converter-tools-2f30a.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressMultipartFileParser);

const notincludevalues = '';
// Extracting Options From Request
function extractOptionsFromRequest(request) {
  const options = {
    inputFile: request.files[0],
    subtitleFiles: request.files[1],
    imageWatermark: request.files[2],
    selectMenuValues: request.body.selectMenu,
    selectForFile: request.body.ConvertFromSelect,
    startingTime: request.body.StartingTime,
    endingTime: request.body.EndingTime,
    resolution: request.body.ResolutionMenu,
    videoCOdec: request.body.videotCodecSelect,
    aspectRatio: request.body.AspectRatioSelect,
    qualityConstant: notincludevalues ? '' : request.body.ConstantQualitySelect,
    presetValue: notincludevalues ? '' : request.body.presetSelect,
    tuning: notincludevalues ? '' : request.body.tuneSelect,
    profileValue: notincludevalues ? '' : request.body.profileSelect,
    levelValue: notincludevalues ? '' : request.body.levelSelect,
    fitValue: request.body.fitSelect,
    framePersecond: request.body.fpsSelect,
    audioCodecSelect: request.body.AudioCodec,
    audioChannels: request.body.ChannelsSelect,
    videoVolume: request.body.VolumeSelect,
    SampleRate: request.body.SampleRateSelect,
    AudioBitrateValue: request.body.BitrateValuesSelect,
    desiredKeyframeInterval: request.body.KeyframeInterval,
    subtitlesType: request.body.subtitleType,
    QscaleValue: request.body.selectMenu === '.wmv' ? request.body.Qscale : '',
  };
  // console.log(options);

  return options;
}

const admin = require('firebase-admin');
const { WritableStream } = require('memory-streams');

// const storage = admin.storage();
const storage = getStorage(adminApp);
const bucket = admin.storage().bucket();

async function convertVideo(req, res) {
  try {
    console.log('Process Start.....');
    const options = extractOptionsFromRequest(req);

    // Download the input file from Firebase Storage
    const inputFileName = options.inputFile.originalname;
    const inputFilePath = `input-files/${inputFileName}`;
    const inputFile = bucket.file(inputFilePath);

    const inputDownloadUrl = await inputFile.getSignedUrl({
      action: 'read',
      expires: '03-17-2025',
    });

    const outputBufferStream = new WritableStream();

    const command = new fluentFfmpeg();
    command.input(inputDownloadUrl[0]);
    command.outputOptions(['-c:v libx264']);
    command.pipe(outputBufferStream);

    await new Promise((resolve, reject) => {
      command.on('end', resolve).on('error', reject);
    });

    const outputFileName = `output-files/converted-${inputFileName.split('.')[0]}.mp4`;
    const outputFile = bucket.file(outputFileName);
    const outputBuffer = Buffer.from(outputBufferStream.toBuffer());
    await outputFile.save(outputBuffer);

    console.log('Conversion completed successfully.');
    const outputDownloadUrl = await outputFile.getSignedUrl({
      action: 'read',
      expires: '03-17-2025',
    });

    res.json({ downloadUrl: outputDownloadUrl[0], errorMessage: '' });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.json({ downloadUrl: '', errorMessage: error.message });
  }
}

// HTTP trigger for convertVideo function
app.post('/convert', convertVideo);

// HTTP trigger for helloWorld function
app.get(
  '/helloWorld',
  onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true });

    // // request data
    // const options = {
    //   inputFile: req.files.uploadFile,
    //   selectMenuValues: req.body.selectMenu,
    //   selectForFile: req.body.ConvertFromSelect,
    //   startingTime: req.body.StartingTime,
    //   endingTime: req.body.EndingTime,
    //   resolution: req.body.ResolutionMenu,
    //   videoCOdec: req.body.videotCodecSelect,
    //   aspectRatio: req.body.AspectRatioSelect,
    //   fitValue: req.body.fitSelect,
    //   framePersecond: req.body.fpsSelect,
    //   audioCodecSelect: req.body.AudioCodec,
    //   audioChannels: req.body.ChannelsSelect,
    //   videoVolume: req.body.VolumeSelect,
    //   SampleRate: req.body.SampleRateSelect,
    // };
    // console.log(options);

    response.send('Hello from Firebase!');
  })
);

exports.api = functions.https.onRequest(app);

// // video convert
// async function convertVideo(req, res) {
//   try {
//     console.log('Process Start.....');
//     const options = extractOptionsFromRequest(req);
//     // console.log(options);

//     // Download the input file
//     const inputFileRef = ref(storage, `input-files/${options.inputFile.originalname}`);
//     await uploadBytes(inputFileRef, options.inputFile.buffer);
//     const inputDownloadUrl = await getDownloadURL(inputFileRef);
//     console.log('Uploaded Input File >> ' + inputDownloadUrl);

//     // Construct output file name
//     const newName = options.inputFile.originalname.split('.');
//     const outputName = newName[0];
//     const outputFileName = `converted-${outputName}${options.selectMenuValues}`;
//     // const outputPath = `./temp-output/${outputFileName}`;
//     // const outputStoragePath = `output-files/${outputFileName}`;
//     // const outputStoragePath = `https://firebasestorage.googleapis.com/v0/b/converter-tools-2f30a.appspot.com/o/input-files%2F${outputFileName}`;

//     // console.log(outputStoragePath);

//     // Convert the file using fluent-ffmpeg
//     const command = new fluentFfmpeg();
//     command.input(inputDownloadUrl);
//     command.videoCodec(options.videoCOdec);
//     command.audioCodec(options.audioCodecSelect);

//     // const outputBuffer = await new Promise((resolve, reject) => {
//     command.toFormat('mp4');
//     // command.on('end', resolve).on('error', reject)
//     // });

//     // command.save(outputStoragePath);
//     // const outputFileBuffer=command.pipe();
//     // Wait for the conversion to finish
//     // await new Promise((resolve, reject) => {
//     //   command.on('end', resolve).on('error', reject);
//     // });
//     // await new Promise((resolve, reject) => {
//     // Event handler for the 'end' event
//     command.on('end', () => {
//       console.log('Conversion completed successfully.');
//       // resolve();
//     });

//     // Event handler for the 'error' event
//     command.on('error', (err, stdout, stderr) => {
//       console.error(`Error during conversion: ${err.message}`);
//       console.error(`stdout: ${stdout}`);
//       console.error(`stderr: ${stderr}`);
//       // reject(err);
//     });
//     // });
//     const outputStoragePath = command.pipe();

//     // console.log('Conversion completed >> ' + outputPath);

//     // Upload the converted file
//     const outputFileRef = ref(storage, outputStoragePath);
//     // const fileBuffer = fs.readFileSync(outputPath);
//     // await uploadBytes(outputFileRef, fileBuffer);
//     await uploadBytes(outputFileRef, outputBuffer);
//     const outputDownloadUrl = await getDownloadURL(outputFileRef);
//     console.log('Uploaded Converted File >> ' + outputDownloadUrl);

//     console.log('Process end');
//     res.json({ downloadUrl: outputDownloadUrl, filedeleted: inputDownloadUrl, metadata: 'completeVideoMetadata', errorMessage: '' });
//   } catch (error) {
//     console.log(error);
//     res.json({ downloadUrl: 'inputDownloadUrl', filedeleted: 'inputDownloadUrl', metadata: 'completeVideoMetadata', errorMessage: error.message });
//   }
// }
