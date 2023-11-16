const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const multer = require('multer');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');
const EventEmitter = require('events');

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

// const eventEmitter = new EventEmitter();
// app.get('/sse', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   const sendProgress = (percentage) => {
//     console.log(percentage);
//     res.write(`event: progress\ndata: ${JSON.stringify({ percentage })}\n\n`);
//   };

//   eventEmitter.on('progress', sendProgress);

//   req.on('close', () => {
//     eventEmitter.off('progress', sendProgress);
//     res.end();
//   });
// });

app.get('/', (req, res) => {
  res.status(200).send('Default');
});

app.options('/test', cors(AllowedDomains), (req, res) => {
  res.sendStatus(200);
});

const emitProgress = (res, percentage) => {
  res.write(`event: progress\ndata: ${JSON.stringify({ percentage })}\n\n`);
  console.log(percentage);
};

app.post('/test', async (req, res) => {
  try {
    // const sendProgress = (percentage) => emitProgress(res, percentage);

    //eventEmitter.emit('progress', 5);

    const [fileUrl] = await Promise.all([uploadToVercelBlob(req)]);
    //eventEmitter.emit('progress', 20);
    console.log('Done Uploading...');

    const downloadUrl = fileUrl.url;
    const imageResponse = await fetch(downloadUrl);
    //eventEmitter.emit('progress', 40);
    console.log('Done Downloading...');

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

    const imageBuffer = await imageResponse.buffer();
    const imageMetadata = await sharp(imageBuffer).metadata();
    const formatWithoutLeadingDot = options.selectMenuValues.slice(1);

    let sharpCommand = sharp(imageBuffer);

    const processingSteps = [
      async () => {
        if (options.fileWidth && options.fileHeight) {
          sharpCommand = sharpCommand.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue });
        }
      },
      async () => {
        if (options.stripValue === 'yes') {
          sharpCommand = sharpCommand.withMetadata(false);
        }
      },
      async () => {
        if (options.orientValue === 'yes') {
          sharpCommand = sharpCommand.rotate();
        }
      },
      async () => {
        if (options.inputFile.originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
          sharpCommand = sharpCommand.toFormat('gif');
        }
      },
      async () => {
        if (imageMetadata.hasAlpha) {
          sharpCommand = sharpCommand.toFormat('png');
        }
      },
    ];

    //eventEmitter.emit('progress', 50);
    // executing all steps in parallel
    await Promise.all(processingSteps.map((step) => step()));
    console.log('Done Converting...');

    // using streaming to improve efficiency
    const sharpStream = sharpCommand.on('info', (info) => console.log('Processing progress:', info));
    //eventEmitter.emit('progress', 70);

    // Upload the converted-image to Vercel Blob
    const webpUrl = await put(`${downloadUrl.split('.')[0]}${options.selectMenuValues}`, sharpStream, {
      access: 'public',
      contentType: `image/${formatWithoutLeadingDot}`,
      token: blobReadWriteToken,
    });
    //eventEmitter.emit('progress', 90);
    console.log('Done Re-Uploading...');

    //eventEmitter.emit('progress', 100);
    res.json({ downloadUrl: webpUrl.url, filedeleted: fileUrl.url, metadata: imageMetadata });

    await del(fileUrl.url, { token: blobReadWriteToken });
    console.log('Done Deleting Input File...');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const uploadToVercelBlob = async (req) => {
  const inputFile = req.file;
  console.log(inputFile.buffer);

  return put(inputFile.originalname, inputFile.buffer, {
    access: 'public',
    contentType: `image/${req.body.selectMenu}`,
    token: blobReadWriteToken,
  });
};

// const emitProgress = (res, percentage) => {
//   res.write(`event: progress\ndata: ${JSON.stringify({ percentage })}\n\n`);
//   console.log(percentage);
//   // server.emit('progress', { percentage });
// };

server.listen(8080, () => {
  console.log(`Server is running on 8080 port`);
});
