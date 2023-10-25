const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');
const fs = require('fs');

// functions
const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');
const { info } = require('console');

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
  const options = {};

  options.inputFile = req.files.uploadFile;
  console.log(options.inputFile);
  options.selectForFile = req.body.ConvertFromSelect;
  options.selectMenuValues = req.body.selectMenu;
  options.fileWidth = req.body.width;
  options.fileHeight = req.body.height;
  options.fitValue = req.body.fit;
  options.stripValue = req.body.strip;

  return options;
};

// configure Sharp Events
const configureSharpEvents = async (sharpStream, options, io, res) => {
  let processedBytes = 0;
  const total = options.inputFile.size;

  sharpStream
    .on('data', (chunk) => {
      if (chunk !== undefined) {
        console.log('Received data chunk: ', chunk.length);
        processedBytes += chunk.length;
        const progressPercent = ((processedBytes / total) * 100).toFixed(2);
        io.emit('progress', progressPercent);
        console.log(progressPercent);
      }
    })
    .on('end', () => {
      const progressPercent = 100;
      io.emit('progress', progressPercent);
      console.log('Conversion Finished.');
    })
    .on('error', (err, chunk, info) => {
      console.error('Info data  --->> ', info);
      console.error('Chunk data  --->> ', chunk);
      console.error('Error:', err);
      io.emit('error', err.message);
    });
};

// sharp metadata function
const configureMetadataUsingSharp = async (path) => {
  let [errorMessages, completeData] = ['', null];
  try {
    completeData = await sharp(path).metadata();
    console.log('address in the sharp metadata function ---------------- ' + path);
  } catch (err) {
    errorMessages = 'Error getting image metadata';
  }

  return { errorMessages, completeData };
};

// video conversion function with sharp
const videoConversionFunctionWithSharp = async (req, res, io) => {
  functions.deleteProcessedFiles();

  const editingoptions = extractOptionsFromRequest(req);
  try {
    const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile, 'temp-files/', functions.processedFiles);

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
    console.log(globalFunctions.fileName);
    functions.processedFiles.push(outputPath);

    const command = new sharp(inputPath);

    configureSharpEvents(command, editingoptions, io, res);
    // trimming noise and extra spaces.
    if (editingoptions.stripValue === 'yes') {
      command.trim();
    }
    // width x height
    if (editingoptions.fileWidth && editingoptions.fileHeight) {
      command.resize(Number(editingoptions.fileWidth), Number(editingoptions.fileHeight));
    }

    const { errorMessages, completeData } = await configureMetadataUsingSharp(inputPath);
    res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData });

    // error
    if (errorMessages !== '') {
      io.emit('error', errorMessages);
      return;
    }

    // saving file to the outputPath directory
    command.toFile(outputPath, (err, info) => {
      if (err) {
        console.log('PNG converted to JPEG:', info);
        console.error('Error converting PNG to JPEG:', err);
      } else {
        console.log('PNG converted to JPEG: >>>>>> ', outputPath);
      }
    });
  } catch (error) {
    console.error('An error occurred in the last try catch:', error);
    res.status(500).send('An error occurred during video conversion.');
  }
};

module.exports = { videoConversionFunctionWithSharp };
