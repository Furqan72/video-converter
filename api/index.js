const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const fs = require('fs');

// routes
const router = require('./router');
// Global Functions
const globalFunctions = require('./global/globalFunctions');
// functions
const imageConverter = require('./functions/imageConverter');
const imageConverterTest = require('./functions/imageConverterTest');

const app = express();
const server = http.createServer(app);

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

console.log('Working!!');

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp-files/',
  })
);

app.use('/', router);

app.use(
  '/temp-output',
  (req, res, next) => {
    const fileName = `${globalFunctions.fileName}`;
    const disposition = `attachment; filename="${fileName}"`;
    res.setHeader('Content-Disposition', disposition);

    next();
  },
  express.static('temp-output')
);

app.post('/test', async (req, res) => {
  const filePathInput = 'temp-files/giffy.gif';
  const filePathOutput = 'temp-output/converted-giffy.png';

  try {
    await sharp(filePathInput).toFormat('png').toFile(filePathOutput);
    const imageName = 'converted-giffy.png';

    res.json({ downloadUrl: filePathOutput, fileName: imageName });
    console.log('Conversion Complete!!');
  } catch (error) {
    console.error('Error converting file:', error);
    res.status(500).send('Error converting file: ', error);
  }
});

// checking for file
app.get('/processed', async (req, res) => {
  const fileNameToCheck = 'converted-giffy.png';
  const filePath = `./temp-output/${fileNameToCheck}`;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File ${fileNameToCheck} does not exist`);
      res.status(404).send(`File ${fileNameToCheck} does not exist`);
      return;
    }

    console.log(`File ${fileNameToCheck} exists`);
    res.status(200).send(`File ${fileNameToCheck} exists`);
  });
});

// server
app.listen(8080, () => {
  console.log('server running on 8080 port');
});
