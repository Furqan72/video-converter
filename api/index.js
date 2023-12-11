const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

// functions
const { videoConversionFunction } = require('./functions/converterTest');
const { imageConversionFunction } = require('./functions/imageConverterTest');

// routes
// const router = require('./router');

// ffmpeg
const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobeStatic = require('ffprobe-static').path;

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobeStatic);
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

const app = express();

const AllowedDomains = {
  origin: ['https://video-converter2.vercel.app', 'https://video-converter2.vercel.app/image-converter', 'https://video-converter2.vercel.app/image-converter/', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Allow'],
  optionsSuccessStatus: 200,
  credentials: false,
};

app.use(cors(AllowedDomains));
// app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app);

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

// post routes
app.post('/video-conversion', videoConversionFunction);
app.post('/image-conversion', imageConversionFunction);

// app.use('/', router);

server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
