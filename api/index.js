const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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

const storage = multer.diskStorage({
  destination: './input-files/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(upload.single('uploadFile'));

// default
app.get('/', (req, res) => {
  res.status(200).send('Default');
});

app.options('/test', cors(AllowedDomains), (req, res) => {
  res.sendStatus(200);
});

const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';
let url;

app.post('/test', async (req, res) => {
  try {
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
    console.log(options);

    const filePath = path.join(__dirname, 'temp-files', options.inputFile.originalname);
    const fileStream = fs.createReadStream(filePath);

    const imageData = fs.readFileSync(filePath);
    console.log('imageData');
    console.log(imageData);

    const uploadUrl = await put(filePath, fileStream, { access: 'public', contentType: `image/${options.selectMenuValues}`, token: blobReadWriteToken });

    url = uploadUrl.url;

    console.log(url);
    res.json({ downloadUrl: url, fileName: options.inputFile.name });
  } catch (error) {
    res.status(200).send('Catch is working!');
  }
});

// server
server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
