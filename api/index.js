const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// routes
const router = require('./router');
// Global Functions
const globalFunctions = require('./global/globalFunctions');
// functions
const imageConverter = require('./functions/imageConverter');

const app = express();
const server = http.createServer(app);

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

console.log('Working!!');

app.use(cors(AllowedDomains));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);

// app.use('/temp-output', express.static('temp-output'));

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

async function sendImageConversionResponse(req, res) {
  try {
    const reqiredData = await imageConverter.imageConversionFunctionWithSharp(req, res);
    res.send({ options: reqiredData });
  } catch (error) {
    res.send({ options: error });
  }
}

app.post('/test', async (req, res) => {
  sendImageConversionResponse(req, res);
});

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
