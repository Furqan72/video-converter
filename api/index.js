const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
// const axios = require('axios');
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

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);

// app.use(
//   '/temp-output',
//   (req, res, next) => {
//     const fileName = `${globalFunctions.fileName}`;
//     const disposition = `attachment; filename="${fileName}"`;
//     res.setHeader('Content-Disposition', disposition);

//     next();
//   },
//   express.static('temp-output')
// );

// default
app.get('/', (req, res) => {
  res.status(200).send('Default');
});

const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';
let url;

async function uploadAndHandleFile(file, directory) {
  return new Promise((resolve, reject) => {
    const fileDirectory = directory + file.name;

    file.mv(fileDirectory, (err) => {
      if (err) {
        console.error('File Upload Error:', err);
        reject(err);
      } else {
        resolve(fileDirectory);
      }
    });
  });
}

app.post('/test', async (req, res) => {
  const options = {
    inputFile: req.files.uploadFile,
    selectMenuValues: req.body.selectMenu,
    fileWidth: req.body.width,
    fileHeight: req.body.height,
    fitValue: req.body.fit,
    stripValue: req.body.strip,
    orientValue: req.body.orient,
    qualityValue: req.body.quality,
  };
  console.log(options);
  // console.log(options.inputFile.name);
  // const fileDirectory = 'temp-files' + options.inputFile.name;
  const inputFilePath = await uploadAndHandleFile(options.inputFile, 'temp-files/');
  console.log(inputFilePath);

  // try {
  // Upload
  const imagePath = path.join(__dirname, 'temp-files', options.inputFile.name);
  const imageData = fs.readFileSync(imagePath);
  console.log(imageData);

  const originalurl = await put('temp-files/' + options.inputFile.name, imageData, { access: 'public', contentType: `image/${options.selectMenuValues}`, token: blobReadWriteToken });
  console.log(originalurl);

  // Convert
  // convertImageToPNG(tempFilePath, outputFilePath);

  // Upload Again
  // const convertedurl = put(outputFilePath, 'image!', { access: 'public', compression: 'none', token: blobReadWriteToken });
  // console.log(convertedurl);

  // res.json({ downloadUrl: convertedurl.url, originalUrl: originalurl.url });
  res.json({ downloadUrl: originalurl.url, fileName: options.inputFile.name });
  // } catch (error) {
  //   console.log('Conversion Failed !!!!!! >> ' + error);
  // }
});

// Convert
const convertImageToPNG = async (inputFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    sharp(inputFilePath).toFormat('png').toFile(outputFilePath).then(resolve).catch(reject);
  });
};

// checking for file
app.get('/processed', async (req, res) => {
  // const fileNameToCheck = 'converted-giffy.png';
  // const filePath = path.join(__dirname, 'temp-output', fileNameToCheck);

  fs.access(url, fs.constants.F_OK, (err) => {
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
server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
