const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');
const fs = require('fs');
// const { info } = require('console');

// functions
const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
  const options = {};

  options.inputFile = req.files.uploadFile;
  console.log(options.inputFile);

  // options.selectForFile = req.body.ConvertFromSelect;
  options.selectMenuValues = req.body.selectMenu;
  options.fileWidth = req.body.width;
  options.fileHeight = req.body.height;
  options.fitValue = req.body.fit;
  options.stripValue = req.body.strip;
  console.log(options);

  return options;
};

// configure Sharp Events => progress
const configureSharpEvents = async (sharpStream, options, io, res) => {
  let processedBytes = 0;
  let extractedText = '';
  const total = options.inputFile.size;

  sharpStream
    .on('data', (chunk) => {
      if (chunk !== undefined) {
        console.log('Received data chunk: ', chunk.length);
        console.log('Received total: ', total);
        processedBytes += chunk.length;
        const progressPercent = ((processedBytes / total) * 100).toFixed(2);
        console.log(progressPercent);
        io.emit('progress', progressPercent);
      }
    })
    .on('end', () => {
      if (extractedText === '') {
        const progressPercent = 100;
        io.emit('progress', progressPercent);
        console.log(progressPercent);
        console.log('Conversion Finished.');
        io.on('endConversion', () => {
          console.log('A Conversion has ended.');
        });
      } else {
        console.log('conversion failed!');
        return;
      }
    })
    .on('error', (err, chunk, info) => {
      try {
        console.error('Info data  --->> ', info);
        console.error('Chunk data  --->> ', chunk);
        console.error('Error:', err);
        io.emit('error', err.message);

        const errorPatterns = /(Unsupported codec|unsupported image format|unable to)/;
        const match = err.message.match(errorPatterns);
        if (match) {
          extractedText = match[0];
          console.log('Extracted-Text  -----------  ', extractedText);
          io.emit('message', extractedText + ' Conversion failed!!');
          res.status(500).send('Conversion Error: ' + err.message);
        }
      } catch (error) {
        console.error('An error occurred while handling the Sharp conversion error:', error);
      }
    });
};

// sharp metadata function
const configureMetadataUsingSharp = async (path) => {
  let [errorMessages, completeData] = ['', null];
  try {
    completeData = await sharp(path).metadata();
    console.log('address in the sharp metadata function ---- ' + path);
  } catch (err) {
    errorMessages = 'Error getting image metadata';
  }

  return { errorMessages, completeData };
};

// video conversion function with sharp
const imageConversionFunctionWithSharp = async (req, res, io) => {
  functions.deleteProcessedFiles();

  const editingoptions = extractOptionsFromRequest(req);
  try {
    const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile, 'temp-files/');

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
    console.log(inputPath + ' ----------------------------------- ' + outputPath);
    functions.processedFiles.push(outputPath);

    const command = sharp(inputPath);

    configureSharpEvents(command, editingoptions, io, res);

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

    // transparent background
    if (completeData.hasAlpha) {
      command.toFormat('png');
    }

    // saving file to the outputPath directory
    command.toFile(outputPath, (err, info) => {
      if (err) {
        console.log('PNG converted to JPEG:', info);
        console.error('Error converting PNG to JPEG:', err);
        return;
      } else {
        console.log('PNG converted to JPEG: >>>>>> ', outputPath);
      }
    });
  } catch (error) {
    console.error('An error occurred in the last try catch:', error);
    // res.status(500).send('An error occurred during image conversion.');
  }
};

module.exports = { imageConversionFunctionWithSharp };
