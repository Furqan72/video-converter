const sharp = require('sharp');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

// const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';
const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_bOTWCUbFieaFtB6h_V4MX4bG2XZyRDsVqgCrWOw23fqAuSs';

const imageConversionFunction = async (req, res) => {
  try {
    const [fileUrl] = await Promise.all([uploadToVercelBlob(req.files.uploadFile)]);
    // const [videoUrl] = await Promise.all([uploadToVercelBlob(req.files.uploadFile)]);

    console.log('Done Uploading... ' + fileUrl.url);

    const downloadUrl = fileUrl.url;
    const imageResponse = await fetch(downloadUrl);
    console.log('Done Downloading...');

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

    const imageBuffer = await imageResponse.buffer();
    const imageMetadata = await sharp(imageBuffer).metadata();
    const formatWithoutLeadingDot = options.selectMenuValues.slice(1);
    let sharpCommand;
    if (options.inputFile[0].originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
      sharpCommand = sharp(imageBuffer, { animated: true });
    } else {
      sharpCommand = sharp(imageBuffer);
    }

    const isImageFormat = ['.png', '.jpg', '.jpeg', '.webp'].includes(options.selectMenuValues);
    if (options.selectMenuValues !== '.odd' && options.selectMenuValues !== '.bmp') {
      sharpCommand = sharpCommand.toFormat(formatWithoutLeadingDot);
      console.log(formatWithoutLeadingDot);

      if (isImageFormat && options.qualityValue) {
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
        if (imageMetadata.hasAlpha) {
          sharpCommand = sharpCommand.toFormat('png');
        }
      },
    ];

    // executing all steps in parallel
    await Promise.all(processingSteps.map((step) => step()));
    console.log('Done Converting...');

    // for maintaining the animation of the Gif file >> It should be applied at the very end to not lose the animation of the image file
    if (options.inputFile[0].originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
      sharpCommand = sharpCommand.gif();
    }

    // using streaming
    const sharpStream = sharpCommand.on('info', (info) => console.log('Processing progress:', info));

    console.log(sharpStream);

    // Upload the converted-image to Vercel Blob
    const webpUrl = await put(`${downloadUrl.split('.')[0]}${options.selectMenuValues}`, sharpStream, {
      access: 'public',
      contentType: `image/${formatWithoutLeadingDot}`,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
    console.log('Done Re-Uploading...' + webpUrl.url);

    res.json({ downloadUrl: webpUrl.url, filedeleted: fileUrl.url, metadata: imageMetadata, errorMessage: '' });

    await del(fileUrl.url, { token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN });
    console.log('Done Deleting Input File...' + fileUrl.url);
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

// file upload function
const uploadToVercelBlob = async (image) => {
  try {
    return await put(image[0].originalname, image[0].buffer, {
      access: 'public',
      contentType: image[0].mimetype,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.log(error);
    // res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: 'Error uploading file' });
  }
};

module.exports = { imageConversionFunction };
