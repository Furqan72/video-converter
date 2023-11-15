const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const multer = require('multer');
const { put } = require('@vercel/blob');
const { del } = require('@vercel/blob');

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

const upload = multer().single('uploadFile');
app.use(upload);

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
    const downloadUrl = fileUrl.url;

    console.log('Done Uploading...');

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

    const imageResponse = await fetch(downloadUrl);
    // console.log(imageResponse);
    if (!imageResponse.ok) {
      throw new Error(`Image download failed with status ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageMetadata = await sharp(imageBuffer).metadata();

    const formatWithoutLeadingDot = options.selectMenuValues.slice(1);

    // Convert using sharp
    // const sharpCommand = await sharp(imageBuffer).toFormat(formatWithoutLeadingDot).toBuffer();
    const sharpCommand = sharp(imageBuffer);

    // let sharpCommand;
    // if (options.inputFile.originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
    //   sharpCommand = sharp(imageBuffer, { animated: true });
    // } else {
    //   sharpCommand = sharp(imageBuffer);
    // }

    if (options.fileWidth && options.fileHeight) {
      sharpCommand.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue });
    }
    if (options.stripValue === 'yes') {
      sharpCommand.withMetadata(false);
    }
    if (options.orientValue === 'yes') {
      sharpCommand.rotate();
    }
    if (options.inputFile.originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
      sharpCommand.toFormat('gif');
    }
    if (imageMetadata.hasAlpha) {
      sharpCommand.toFormat('png');
    }

    sharpCommand.toBuffer();

    console.log('Done Editing...');

    // Upload the converted-image to Vercel Blob
    const webpUrl = await put(`${downloadUrl.split('.')[0]}${options.selectMenuValues}`, sharpCommand, { access: 'public', contentType: `image/${formatWithoutLeadingDot}`, token: blobReadWriteToken });

    console.log('Done Re-Uploading...');

    del(fileUrl.url, { token: blobReadWriteToken })
      .then(() => {
        console.log('Blob deleted');
      })
      .catch((error) => {
        console.error('Error deleting blob', error);
      });

    const deletedFile = fileUrl.url;
    // const deletedFile = '';

    res.json({ downloadUrl: webpUrl.url, filedeleted: deletedFile });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// uploading file
const uploadToVercelBlob = async (req) => {
  const inputFile = await req.file;
  console.log(inputFile.buffer);

  const uploadUrl = await put(inputFile.originalname, inputFile.buffer, { access: 'public', contentType: `image/${req.body.selectMenu}`, token: blobReadWriteToken });
  return uploadUrl;
};

// server
server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
