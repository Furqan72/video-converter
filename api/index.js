const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const multer = require('multer');

const app = express();
const server = http.createServer(app);

// routes
const router = require('./router');

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
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

// app.options('/test', cors(AllowedDomains), (req, res) => {
//   res.sendStatus(200);
// });

// router
app.use('/', router);

server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
