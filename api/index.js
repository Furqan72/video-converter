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
    tempFileDir: './tmp/',
  })
);

app.use(
  '/tmp',
  (req, res, next) => {
    const fileName = `${globalFunctions.fileName}`;
    const disposition = `attachment; filename="${fileName}"`;
    res.setHeader('Content-Disposition', disposition);

    next();
  },
  express.static('tmp')
);

app.post('/test', async (req, res) => {
  const reqiredData = sharp('tmp/image-1kb.jpg')
    .toFormat('png')
    .toFile('./tmp/converted-image-1kb.png', async (err, info) => {
      if (err) {
        console.error('Error converting file:', err);
      } else {
        console.log('File converted:', info);
      }
    });

  // const reqiredData = await sharp('temp-files/image-1kb.jpg').toFormat('png').toBuffer();

  console.log('newfile => ' + JSON.stringify(reqiredData, null, 2));
  console.log('newfile => ' + reqiredData.options.fileOut);

  const imageName = 'converted-image-1kb.png';
  const errorMessages = '';
  const completeData = '';

  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', 'attachment; filename="converted-image.png"');
  res.json({ downloadUrl: reqiredData.options.fileOut, fileName: imageName, message: errorMessages, fullVideoData: completeData });
  res.end();
});

// if (process.env.NODE_ENV !== 'production') {
app.listen(8080, () => {
  console.log('server running on 8080 port');
});
// } else {
//   module.exports = app;
// }

// app.post('/test', async (req, res) => {
//     const convertedImageBuffer = await sharp('tmp/image-1kb.jpg').toFormat('png').toBuffer();
//     const imageName = 'converted-image.png';

//     // Set headers for the response
//     res.set('Content-Type', 'image/png');
//     res.set('Content-Disposition', `attachment; filename="${imageName}"`);
//     res.send(convertedImageBuffer);
// });
