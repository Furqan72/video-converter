const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');

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
    tempFileDir: './temp-files/',
  })
);

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
  console.log('Requesstionediej ');
  console.log(req.body);

  const reqiredData = sharp('temp-files/SampleJPGImage_50kbmb_-_Copy_2_1.jpg')
    .toFormat('png')
    .toFile('./temp-output/converted-SampleJPGImage_50kbmb_-_Copy_2_1.png', async (err, info) => {
      if (err) {
        console.error('Error converting file:', err);
      } else {
        console.log('File converted:', info);
      }
    });

  console.log('newfile => ' + JSON.stringify(reqiredData, null, 2));
  console.log('newfile => ' + reqiredData.options.fileOut);

  const imageName = 'converted-SampleJPGImage_50kbmb_-_Copy_2_1.png';
  const errorMessages = '';
  const completeData = '';

  res.json({ downloadUrl: reqiredData.options.fileOut, fileName: imageName, message: errorMessages, fullVideoData: completeData });
  res.end();
});

server.listen(8080, () => {
  console.log('server running on 8080 port');
});
