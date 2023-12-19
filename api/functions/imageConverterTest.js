const sharp = require('sharp');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

const BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = 'vercel_blob_rw_8oL0c4E3y4emK5Iq_mNmffcqTL3VgnPvoTKAxDK3jiN3PvD';

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

// Extracting Options From Request
function extractOptionsFromRequest(req) {
  const settings = {
    inputFile: req.files.uploadFile,
    selectMenuValues: req.body.selectMenu,
    fileWidth: req.body.width,
    fileHeight: req.body.height,
    fitValue: req.body.fit,
    stripValue: req.body.strip,
    orientValue: req.body.orient,
    qualityValue: req.body.quality,
  };

  return settings;
}

// processing steps
const processImage = async (sharpCommand, options, imageMetadata) => {
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

  await Promise.all(processingSteps.map((step) => step()));
};

// Quality Compression
const qualityCompression = (sharpCommand, qualityValue, selectMenuValues) => {
  // webp
  if (selectMenuValues === '.webp') {
    sharpCommand.webp({ quality: Number(qualityValue), lossless: false, webp: 'normal' });
    // jpg
  } else if (selectMenuValues === '.jpg') {
    sharpCommand.jpeg({ quality: Number(qualityValue) });
    // png
  } else if (selectMenuValues === '.png') {
    const zlibLevel = Math.min(Math.floor(Number(qualityValue) / 10), 9); // Values between 0 and 9
    const filterType = Math.min(Number(qualityValue) % 10, 6); // Values between 0 and 6
    sharpCommand.png({ compressionLevel: zlibLevel, filter: filterType });
  }
};

// COnverting image
const convertImage = async (imageBuffer, options, imageMetadata) => {
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
      qualityCompression(sharpCommand, options.qualityValue, options.selectMenuValues);
    }
  }

  // processing steps
  await processImage(sharpCommand, options, imageMetadata);
  console.log('Done Converting...');

  // for maintaining the animation of the Gif file >> It should be applied at the very end to not lose the animation of the image file
  if (options.inputFile[0].originalname.endsWith('.gif') && options.selectMenuValues === '.gif') {
    sharpCommand = sharpCommand.gif();
  }

  return sharpCommand.on('info', (info) => console.log('Processing progress:', info));
};

// Upload the converted-image to Vercel Blob and delete file
const uploadAndDeleteFiles = async (res, downloadUrl, sharpStream, formatWithoutLeadingDot, selectMenuValues, completeMetadata) => {
  try {
    // The upload function might take some time, so you may want to wait for it to complete before continuing
    const uploadResult = await put(`${downloadUrl.split('.')[0]}${selectMenuValues}`, sharpStream, {
      access: 'public',
      contentType: `image/${formatWithoutLeadingDot}`,
      token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
    });
    console.log('Done Re-Uploading...' + uploadResult.url);

    res.json({ downloadUrl: uploadResult.url, filedeleted: downloadUrl, metadata: completeMetadata, errorMessage: '' });

    await del(downloadUrl, { token: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN });
    console.log('Done Deleting Input File...' + downloadUrl);
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

// Main function for converting
const imageConversionFunction = async (req, res) => {
  console.log('process start');
  try {
    const [fileUrl] = await Promise.all([uploadToVercelBlob(req.files.uploadFile)]);
    console.log('Done Uploading... ' + fileUrl.url);

    const downloadUrl = fileUrl.url;
    const imageResponse = await fetch(downloadUrl);
    console.log('Done Downloading...');

    const options = extractOptionsFromRequest(req);
    console.log(options);

    const formatWithoutLeadingDot = options.selectMenuValues.slice(1);
    const imageBuffer = await imageResponse.buffer();
    const imageMetadata = await sharp(imageBuffer).metadata();

    const sharpCommand = await convertImage(imageBuffer, options, imageMetadata);
    console.log(sharpCommand);

    await uploadAndDeleteFiles(res, fileUrl.url, sharpCommand, formatWithoutLeadingDot, options.selectMenuValues, imageMetadata);
  } catch (error) {
    console.error(error);
    res.json({ downloadUrl: '', filedeleted: '', metadata: '', errorMessage: error.message });
  }
};

module.exports = { imageConversionFunction };
