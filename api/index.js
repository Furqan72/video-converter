const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { put } = require('@vercel/blob');

const app = express();
const server = http.createServer(app);

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

const uploadToVercelBlob = async (req) => {
  const inputFile = await req.file;
  console.log(inputFile.buffer);

  const uploadUrl = await put(inputFile.originalname, inputFile.buffer, { access: 'public', contentType: `image/${req.body.selectMenu}`, token: blobReadWriteToken });
  return uploadUrl;
};

const upload = multer().single('uploadFile');
app.use(upload);

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
// }).single('uploadFile');
// app.use(upload);

// default
app.get('/', (req, res) => {
  res.status(200).send('Default');
});

app.options('/test', cors(AllowedDomains), (req, res) => {
  res.sendStatus(200);
});

app.post('/test', async (req, res) => {
  try {
    const fileUrl = await uploadToVercelBlob(req);

    const options = {
      inputFile: req.file,
      selectMenuValues: req.body.selectMenu,
      fileWidth: req.body.width,
      fileHeight: req.body.height,
      fitValue: req.body.fit,
      stripValue: req.body.strip,
      orientValue: req.body.orient,
      qualityValue: req.body.quality,
    };
    const filename = options.inputFile.originalname;

    res.json({ downloadUrl: fileUrl.url, fileName: filename });
  } catch (error) {
    console.log(error);
    // res.status(500).send(error.message);
  }
});

// server
server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
