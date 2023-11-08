const sharp = require('sharp');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');

let processedImages = [];
const extractOptionsFromRequest = (req) => {
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
  return options;
};

const configureSharpEvents = async (sharpStream, options, io) => {
  let processedBytes = 0;
  let extractedText = '';
  const total = options.inputFile.size;

  sharpStream
    .on('data', (chunk) => {
      if (chunk !== undefined) {
        const newpercent = 0;
        io.emit('progress', newpercent);
        console.log('Received data chunk:', chunk.length);
        console.log('Received total:', total);
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
        sharpStream.end();

        console.log(progressPercent);
        console.log('Conversion Finished.');
        io.emit('disconnectUser');
        io.emit('endConversion');
      } else {
        console.log('Conversion Failed!!!!!');
      }
    })
    // sharpStream
    .on('close', () => {
      // The Sharp image operation has been canceled.
      console.log('The Sharp image operation has been canceled.');
    })
    .on('error', (err, chunk, info) => {
      try {
        console.error('Info data --->>', info);
        console.error('Chunk data --->>', chunk);
        console.error('Error:', err);
        io.emit('error', err.message);

        const errorPatterns = /(Unsupported codec|unsupported image format|unable to)/;
        const match = err.message.match(errorPatterns);
        if (match) {
          extractedText = match[0];
          console.log('Extracted-Text -----------', extractedText);
          io.emit('message', extractedText + ' Conversion failed!!');
          console.log('Conversion Error: ' + err.message);
        }
      } catch (error) {
        console.error('An error occurred while handling the Sharp conversion error:', error);
      }
    });
  console.log('and still runninggggggg..................');
};

const configureMetadataUsingSharp = async (path) => {
  let errorMessages = '';
  let completeData = null;

  try {
    completeData = await sharp(path).metadata();
    const imageWidth = completeData.width;
    console.log('Frames ==> ' + completeData.frameCount);
    console.log('Address in the sharp metadata function ---- ' + path);
  } catch (err) {
    errorMessages = 'Error getting image metadata';
  }

  return { errorMessages, completeData };
};

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

const deleteProcessedFiles = async () => {
  console.log('Processed Files ->', processedImages);
  const filesToDelete = [];

  const deleteFilePromises = processedImages.map(async (file) => {
    try {
      await unlinkAsync(file);
      console.log(`Deleted file: ${file}`);
    } catch (err) {
      console.error('Error:', err);
      filesToDelete.push(file);
    }
  });

  processedImages = [];

  try {
    await Promise.all(deleteFilePromises);
    console.log('Remaining Files in the Array =>', filesToDelete.join(', ') + '.');
  } catch (err) {
    console.error('Error deleting files:', err);
  }
};

const configureEditingOptions = async (command, options, metadata) => {
  // width x height    // fit= max, scale or crop
  if (options.fileWidth && options.fileHeight) {
    command.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue });
  }
  // removing EXIF data
  if (options.stripValue === 'yes') {
    command.withMetadata(false);
  }
  // automatically rotate the image correctly, based on EXIF information
  if (options.orientValue === 'yes') {
    command.rotate();
  }
  // animation for gif image
  if (options.inputFile.name.endsWith('.gif') && options.selectMenuValues === '.gif') {
    command.toFormat('gif');
  }
  // transparent background
  if (metadata.hasAlpha && !(options.inputFile.name.endsWith('.gif') && options.selectMenuValues === '.gif')) {
    command.toFormat('png');
  }
};

const imageConversionFunctionWithSharp = async (req, res, io) => {
  io.emit('startConversion');
  deleteProcessedFiles();

  const editingoptions = extractOptionsFromRequest(req);

  try {
    if (!editingoptions.inputFile) {
      throw new Error('No file uploaded.');
    }

    const inputPath = await uploadAndHandleFile(editingoptions.inputFile, 'temp-files/');
    console.log(inputPath);
    if (!fs.existsSync(inputPath)) {
      console.log(`Input file not found: ${inputPath}`);
      return;
    }
    processedImages.push(inputPath);

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
    processedImages.push(outputPath);

    let sharpCommand;
    if (editingoptions.inputFile.name.endsWith('.gif') && editingoptions.selectMenuValues === '.gif') {
      sharpCommand = sharp(inputPath, { animated: true });
    } else {
      sharpCommand = sharp(inputPath, { animated: true });
    }

    configureSharpEvents(sharpCommand, editingoptions, io);

    const { errorMessages, completeData } = await configureMetadataUsingSharp(inputPath);
    res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData });

    if (errorMessages !== '') {
      io.emit('error', errorMessages);
      io.emit('endConversion');
      return;
    }

    // editing options for the image
    configureEditingOptions(sharpCommand, editingoptions, completeData);

    // saving file
    if (editingoptions.inputFile.name.endsWith('.gif') && editingoptions.selectMenuValues === '.gif') {
      sharpCommand.toBuffer((err, outputBuffer, info) => {
        if (err) {
          console.log('File conversion error:', info);
          console.error('Error converting file:', err);
        } else {
          console.log('File converted: >>+++++++>>', outputPath);
          fs.writeFileSync(outputPath, outputBuffer);
          // sharpCommand.toFile
        }
      });
    } else
      sharpCommand.toFile(outputPath, (err, info) => {
        if (err) {
          console.log('File conversion error:', info);
          console.error('Error converting file:', err);
        } else {
          console.log('File converted: >>>>>>', outputPath);
        }
      });
    io.emit('endConversion');
    io.emit('disconnectUser');
    console.log('and still running...........22');

    //
  } catch (error) {
    console.error('An error occurred in the last try catch:', error);
    io.emit('error', error.message);
  }
};

module.exports = { imageConversionFunctionWithSharp };
