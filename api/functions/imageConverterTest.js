const sharp = require('sharp');
const { put, del } = require('@vercel/blob');
const fetch = require('node-fetch');

const blobReadWriteToken = 'vercel_blob_rw_EFYOeCFX9EdYVGyD_SJr8uIJfOXt7ydLZ7xYtfAcKkm2Vdj';

// const fs = require('fs');
// const { promisify } = require('util');
// const unlinkAsync = promisify(fs.unlink);

// // function
// const globalFunctions = require('../global/globalFunctions');
// const functions = require('./functions');

// let processedImages = [];
// const extractOptionsFromRequest = (req) => {
//   const options = {
//     // inputFile: req.files.uploadFile,
//     // manu: req.,
//     selectMenuValues: req.body.selectMenu,
//     fileWidth: req.body.width,
//     fileHeight: req.body.height,
//     fitValue: req.body.fit,
//     stripValue: req.body.strip,
//     orientValue: req.body.orient,
//     qualityValue: req.body.quality,
//   };
//   console.log('OPTIONS = ');
//   console.log(options);
//   return options;
// };

// // const configureSharpEvents = async (sharpStream, options, metadata) => {
// //   let processedBytes = 0;
// //   let extractedText = '';
// //   const total = options.inputFile.size;

// //   sharpStream
// //     .on('data', (chunk) => {
// //       if (chunk !== undefined) {
// //         const newpercent = 0;
// //         // io.emit('progress', newpercent);
// //         console.log('Received data chunk:', chunk.length);
// //         console.log('Received total:', total);
// //         processedBytes += chunk.length;
// //         const progressPercent = ((processedBytes / total) * 100).toFixed(2);
// //         console.log(progressPercent);
// //         // io.emit('progress', progressPercent);
// //       }
// //     })
// //     .on('end', () => {
// //       if (extractedText === '') {
// //         const progressPercent = 100;
// //         // io.emit('progress', progressPercent);
// //         sharpStream.end();

// //         console.log(progressPercent);
// //         console.log('Conversion Finished.');
// //         // io.emit('disconnectUser');
// //         // io.emit('endConversion');
// //       } else {
// //         console.log('Conversion Failed!!!!!');
// //       }
// //     })
// //     // sharpStream
// //     .on('close', () => {
// //       // The Sharp image operation has been canceled.
// //       console.log('The Sharp image operation has been canceled.');
// //     })
// //     .on('error', (err, chunk, info) => {
// //       try {
// //         console.error('Info data --->>', info);
// //         console.error('Chunk data --->>', chunk);
// //         console.error('Error:', err);
// //         // io.emit('error', err.message);

// //         const errorPatterns = /(Unsupported codec|unsupported image format|unable to)/;
// //         const match = err.message.match(errorPatterns);
// //         if (match) {
// //           extractedText = match[0];
// //           console.log('Extracted-Text -----------', extractedText);
// //           // io.emit('message', extractedText + ' Conversion failed!!');
// //           console.log('Conversion Error: ' + err.message);
// //         }
// //       } catch (error) {
// //         console.error('An error occurred while handling the Sharp conversion error:', error);
// //       }
// //     });
// //   console.log('and still runninggggggg..................');
// // };

// const configureMetadataUsingSharp = async (path) => {
//   let errorMessages = '';
//   let completeData = null;

//   try {
//     completeData = await sharp(path).metadata();
//     const imageWidth = completeData.width;
//     console.log('Frames ==> ' + completeData.frameCount);
//     console.log('Address in the sharp metadata function ---- ' + path);
//   } catch (err) {
//     errorMessages = 'Error getting image metadata';
//   }

//   return { errorMessages, completeData };
// };

// // async function uploadAndHandleFile(file, directory) {
// //   return new Promise((resolve, reject) => {
// //     const fileDirectory = directory + file.name;

// //     file.mv(fileDirectory, (err) => {
// //       if (err) {
// //         console.error('File Upload Error:', err);
// //         reject(err);
// //       } else {
// //         resolve(fileDirectory);
// //       }
// //     });
// //   });
// // }

// const deleteProcessedFiles = async () => {
//   console.log('Processed Files ->', processedImages);
//   const filesToDelete = [];

//   const deleteFilePromises = processedImages.map(async (file) => {
//     try {
//       await unlinkAsync(file);
//       console.log(`Deleted file: ${file}`);
//     } catch (err) {
//       console.error('Error:', err);
//       filesToDelete.push(file);
//     }
//   });
//   processedImages = [];

//   try {
//     await Promise.all(deleteFilePromises);
//     console.log('Remaining Files in the Array =>', filesToDelete.join(', ') + '.');
//   } catch (err) {
//     console.error('Error deleting files:', err);
//   }
// };

// const configureEditingOptions = async (command, options, metadata) => {
//   if (options.fileWidth && options.fileHeight) {
//     command.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue });
//   }
//   if (options.stripValue === 'yes') {
//     command.withMetadata(false);
//   }
//   if (options.orientValue === 'yes') {
//     command.rotate();
//   }
//   // transparent background
//   if (metadata.hasAlpha) {
//     command.toFormat('png');
//   }
// };

// const imageConversionFunctionWithSharp = async (req, res) => {
//   await deleteProcessedFiles();

//   const editingoptions = extractOptionsFromRequest(req);
//   try {
//     const inputPath = 'temp-files/image-1kb.jpg';
//     processedImages.push(inputPath);

//     const imageName = `converted-image-1kb${editingoptions.selectMenuValues}`;
//     console.log(imageName);
//     const outputPath = `./temp-output/converted-image-1kb${editingoptions.selectMenuValues}`;
//     globalFunctions.fileName = 'sampelimg1' + editingoptions.selectMenuValues;
//     processedImages.push(outputPath);

//     let sharpCommand = sharp(inputPath);

//     const { errorMessages, completeData } = await configureMetadataUsingSharp(inputPath);
//     // res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData });

//     if (errorMessages !== '') {
//       // io.emit('error', errorMessages);
//       // io.emit('endConversion');
//       return;
//     }

//     configureEditingOptions(sharpCommand, editingoptions, completeData);

//     // saving file
//     sharpCommand.toFile(outputPath, (err, info) => {
//       if (err) {
//         console.log('File conversion error:', info);
//         console.error('Error converting file:', err);
//       } else {
//         console.log('File converted: >>>>>>', outputPath);
//       }
//     });
//     console.log('and still running...........22');
//     sharpCommand.end();

//     return { downloadUrl: outputPath, fileName: imageName, message: errorMessages, fullVideoData: completeData };
//   } catch (error) {
//     console.error('An error occurred in the last try catch:', error);
//   }
// };

const imageConversionFunction = async (req, res) => {
  // app.post('/test', async (req, res) => {
  try {
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

    if (options.selectMenuValues !== '.odd' && options.selectMenuValues !== '.bmp') {
      sharpCommand = sharpCommand.toFormat(formatWithoutLeadingDot);
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
      // async () => {
      //   if (options.selectMenuValues === '.png' || options.selectMenuValues === '.jpg' || options.selectMenuValues === '.jpeg' || options.selectMenuValues === '.webp') {
      // sharpCommand = sharpCommand.({ quality: options.qualityValue });
      //   }
      // },
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

// const emitProgress = (res, percentage) => {
//   res.write(`event: progress\ndata: ${JSON.stringify({ percentage })}\n\n`);
//   console.log(percentage);
//   // server.emit('progress', { percentage });
// };

module.exports = { imageConversionFunction };
