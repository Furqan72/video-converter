const sharp = require('sharp');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

const imageConversionFunction = async (req, res) => {
  try {
    const [fileUrl] = await Promise.all([uploadToVercelBlob(req)]);
    console.log('Done Uploading...');

    const downloadUrl = fileUrl.url;
    const imageResponse = await fetch(downloadUrl);
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

    const isImageFormat = ['.png', '.jpg', '.jpeg', '.webp'].includes(options.selectMenuValues);
    if (options.selectMenuValues !== '.odd' && options.selectMenuValues !== '.bmp') {
      sharpCommand = sharpCommand.toFormat(formatWithoutLeadingDot);

      if (isImageFormat) {
        sharpCommand = sharpCommand.toFormat(formatWithoutLeadingDot, {
          quality: Number(options.qualityValue),
        });
      }
    }

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

    // executing all steps in parallel
    await Promise.all(processingSteps.map((step) => step()));
    console.log('Done Converting...');

    // using streaming
    const sharpStream = sharpCommand.on('info', (info) => console.log('Processing progress:', info));

    // Upload the converted-image to Vercel Blob
    const webpUrl = await put(`${downloadUrl.split('.')[0]}${options.selectMenuValues}`, sharpStream, {
      access: 'public',
      contentType: `image/${formatWithoutLeadingDot}`,
      token: blobReadWriteToken,
    });
    console.log('Done Re-Uploading...');

    res.json({ downloadUrl: webpUrl.url, filedeleted: fileUrl.url, metadata: imageMetadata });

    await del(fileUrl.url, { token: blobReadWriteToken });
    console.log('Done Deleting Input File...');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const uploadToVercelBlob = async (req) => {
  const inputFile = req.file;
  console.log(inputFile.buffer);

  return put(inputFile.originalname, inputFile.buffer, {
    access: 'public',
    contentType: `image/${req.body.selectMenu}`,
    token: blobReadWriteToken,
  });
};

module.exports = { imageConversionFunction };
