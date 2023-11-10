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

// app.get('/', (req, res) => {
//   console.log('Success.....');
//   res.end();
// });

app.post('/test', async (req, res, next) => {
  console.log('Requesstionediej ');
  console.log(req.body);

  sharp('./temp-files/converted-image-1kb.jpg')
    .toFormat('png')
    .toFile('./temp-output/converted-image-1kb.png', (err, info) => {
      if (err) {
        console.error('Error converting file:', err);
      } else {
        console.log('File converted:', info);
      }
    });

  const options = 'file converted.................';
  // const reqiredData = await imageConverterTest.imageConversionFunctionWithSharp(req, res);
  // console.log(reqiredData);
  // res.json({ options: reqiredData });
  res.send(options);
  next();
});

// app.post('/test', async (req, res, next) => {
//   console.log('Requesstionediej::::: ');
//   console.log(req.body);

//   const reqiredData = await imageConverterTest.imageConversionFunctionWithSharp(req, res);
//   console.log(reqiredData);
//   // res.json({ options: reqiredData });
//   res.send({ options });
//   next();
// });

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
