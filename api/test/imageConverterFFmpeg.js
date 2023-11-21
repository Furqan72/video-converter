const ffmpeg = require('fluent-ffmpeg');
// const socketIo = require('socket.io');

// functions
const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
  const options = {};

  options.inputFile = req.files.uploadFile;
  options.selectMenuValues = req.body.selectMenu;
  options.fileWidth = req.body.width;
  options.fileHeight = req.body.height;
  options.fitValue = req.body.fit;
  options.stripValue = req.body.strip;
  console.log(options);
  return options;
};

// Image Conversion FFmpeg events
const configureFFmpegEvents = (command, io, res) => {
  command
    .on('start', () => {
      console.log('message', 'Conversion Started.');
    })
    .on('progress', (progress) => {
      if (progress.percent !== undefined) {
        const progressPercent = progress.percent.toFixed(2);
        // io.emit('progress', progressPercent);
        console.log(progressPercent);
      }
    })
    .on('end', () => {
      const progressPercent = 100;
      // io.emit('progress', progressPercent);
      // io.on('endConversion', () => {
        console.log('A Conversion has ended.');
      // });
      console.log('message', 'Conversion Finished.');
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('Error:', err);
        console.error('FFmpeg stderr:', stderr);
        console.error('FFmpeg stdout:', stdout);

        // Handle error messages
        const errorLines = stderr.split('\n');
        const errorPatterns = /error pattern here/; // Define your error pattern

        // Extract relevant error message
        let extractedText = '';
        errorMessages.forEach((errorMessage) => {
          const indexOfClosingBracket = errorMessage.indexOf(']');
          if (indexOfClosingBracket !== -1) {
            extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
          }
        });

        console.log('Error  -----------  ', extractedText);

        // io.emit('message', extractedText + ' Conversion failed!!');
        res.status(500).send('Conversion Error: ' + err.message);
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
// };

// Define the upload function
// const uploadFile = async (file, uploadDirectory) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject('No file provided.');
//       return;
//     }

//     const filePath = `${uploadDirectory}/${file.name}`;

//     file.mv(filePath, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(filePath);
//       }
//     });
//   });
// };

const uploadFile = async (file, uploadDirectory) => {
  return new Promise((resolve, reject) => {
    // if (!file || !file.mv) {
    //   reject('Invalid file provided.');
    //   return;
    // }

    const filePath = `${uploadDirectory}/${file.name}`;

    file.mv(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
};

const handleFileUpload = (file, destination, processedFiles) => {
  return new Promise((resolve, reject) => {
    functions
      .uploadFile(file, destination)
      .then((uploadedFilePath) => {
        processedFiles.push(uploadedFilePath);
        resolve(uploadedFilePath);
        console.log('file uploaded successfully.' + processedFiles);
      })
      .catch((error) => {
        console.log('Error uploading file: ' + error);
        reject(error);
      });
  });
};

// Image conversion function with FFmpeg
const imageConversionFunctionWithFFmpeg = async (req, res, io) => {
  functions.deleteProcessedFiles();

  const editingoptions = extractOptionsFromRequest(req);
  try {
    // Upload input image
    console.log(editingoptions.inputFile.name);
    // const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile.name, 'temp-files/');
    const inputPath = await handleFileUpload(editingoptions.inputFile, 'temp-files/', functions.processedFiles);
    // const inputPath = await uploadFile(editingoptions.inputFile.name, 'temp-files/');

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
    console.log(globalFunctions.fileName);
    functions.processedFiles.push(outputPath);
    console.log(functions.processedFiles);

    const command = new ffmpeg(inputPath);

    // Configure FFmpeg events
    configureFFmpegEvents(command, io, res);

    // Execute the conversion
    command.save(outputPath);

    // Respond with the result
    res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues });
  } catch (error) {
    console.error('An error occurred during image conversion:', error);
  }
};

// Extracting Options From Request
// const extractOptionsFromRequest = (req) => {
//   const options = {};

//   options.selectMenuValues = req.body.selectMenu;
//   options.fileWidth = req.body.width;
//   options.fileHeight = req.body.height;
//   options.fitValue = req.body.fit;
//   options.stripValue = req.body.strip;
//   // console.log(options);

//   return options;
// };

// // Image Conversion FFmepg events
// const configureFFmpegEvents = (command, io, res) => {
//   command
//     .on('start', () => {
//       console.log('message', 'Conversion Started.');
//     })
//     .on('progress', (progress) => {
//       if (progress.percent !== undefined) {
//         const progressPercent = progress.percent.toFixed(2);
//         // io.emit('progress', progressPercent);
//         console.log(progressPercent);
//       }
//     })
//     .on('end', () => {
//       const progressPercent = 100;
//       // io.emit('progress', progressPercent);
//       // io.on('endConversion', () => {
//         console.log('A Conversion has ended.');
//       });
//       console.log('message', 'Conversion Finished.');
//     })
//     .on('error', (err, stdout, stderr) => {
//       try {
//         console.error('Error:', err);
//         console.error('FFmpeg stderr:', stderr);
//         console.error('FFmpeg stdout:', stdout);

//         const errorLines = stderr.split('\n');
//         const errorPatterns = /(Could not find|supported)/;
//         const errorMessages = errorLines.filter((line) => errorPatterns.test(line));

//         let extractedText = '';
//         errorMessages.forEach((errorMessage) => {
//           const indexOfClosingBracket = errorMessage.indexOf(']');
//           if (indexOfClosingBracket !== -1) {
//             extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
//           }
//         });
//         console.log('Error  -----------  ', extractedText);

//         // io.emit('message', extractedText + ' Conversion failed!!');
//         res.status(500).send('Conversion Error: ' + err.message);
//       } catch (error) {
//         console.error('An error occurred while handling the FFmpeg error:', error);
//       }
//     });
// };

// // Metadata
// const configureTrimming = async (path) => {
//   let [errorMessages, completeData] = ['', ''];

//   try {
//     const metadata = await functions.getVideoMetadata(path);
//     completeData = metadata;
//   } catch (err) {
//     console.log('not working');
//     errorMessages = 'Error retrieving image metadata. Please try again or upload another file.';
//   }

//   return { errorMessages, completeData };
// };

// // image conversion function
// const imageConversionFunctionWithFFmpeg = async (req, res, io) => {
//   functions.deleteProcessedFiles();

//   const editingoptions = extractOptionsFromRequest(req);
//   try {
//     // Upload input file (image)
//     const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile.name, 'temp-files/');

//     const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
//     const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
//     const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
//     globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
//     console.log(globalFunctions.fileName);
//     functions.processedFiles.push(outputPath);
//     console.log(functions.processedFiles);

//     const command = new ffmpeg(inputPath);

//     // FFmpeg --> start,progress,end,error
//     configureFFmpegEvents(command, io, res);

//     // Trimming Configuration
//     const { errorMessages, completeData } = await configureTrimming(inputPath);

//     // error
//     if (errorMessages !== '') {
//       console.log('Error while trimming the image..........' + errorMessages);
//       // io.emit('error', errorMessages);
//       return;
//     }
//     hasEmbeddedSubtitles = checkSubtitles;
//     console.log(hasEmbeddedSubtitles);

//     command.save(outputPath);
//     res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullimageData: completeData });
//     // Handle any unexpected errors
//   } catch (error) {
//     console.error('An error occurred in the last try catch:', error);
//     res.status(500).send('An error occurred during image conversion.');
//   }
// };

// // FFmpeg events configuration
// const configureFFmpegEvents = (command, io, res) => {
//   command
//     .on('start', () => {
//       console.log('message', 'Conversion Started.');
//     })
//     .on('progress', (progress) => {
//       if (progress.percent !== undefined) {
//         const progressPercent = progress.percent.toFixed(2);
//         // io.emit('progress', progressPercent);
//         console.log(progressPercent);
//       }
//     })
//     .on('end', () => {
//       const progressPercent = 100;
//       // io.emit('progress', progressPercent);
//       // io.on('endConversion', () => {
//         console.log('A Conversion has ended.');
//       });
//       console.log('message', 'Conversion Finished.');
//     })
//     .on('error', (err, stdout, stderr) => {
//       try {
//         console.error('Error:', err);
//         console.error('FFmpeg stderr:', stderr);
//         console.error('FFmpeg stdout:', stdout);

//         // Handle error messages
//         const errorLines = stderr.split('\n');
//         const errorPatterns = /error pattern here/; // Define your error pattern

//         // Extract relevant error message
//         let extractedText = '';
//         errorMessages.forEach((errorMessage) => {
//           const indexOfClosingBracket = errorMessage.indexOf(']');
//           if (indexOfClosingBracket !== -1) {
//             extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
//           }
//         });

//         console.log('Error  -----------  ', extractedText);

//         // io.emit('message', extractedText + ' Conversion failed!!');
//         res.status(500).send('Conversion Error: ' + err.message);
//       } catch (error) {
//         console.error('An error occurred while handling the FFmpeg error:', error);
//       }
//     });
// };

// // Image conversion function
// const imageConversionFunctionWithFFmpeg = async (req, res, io) => {
//   // Deleting previous converted files
//   functions.deleteProcessedFiles();

//   // Extract options from the form
//   const editingoptions = extractOptionsFromRequest(req);

//   try {
//     // Upload input image
//     const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile, 'temp-files/', functions.processedFiles);

//     const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
//     const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
//     const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
//     globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
//     functions.processedFiles.push(outputPath);

//     const command = new ffmpeg(inputPath);

//     // Configure FFmpeg events
//     configureFFmpegEvents(command, io, res);

//     // Execute the conversion
//     command.save(outputPath);

//     // Respond with the result
//     res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues });
//   } catch (error) {
//     console.error('An error occurred during image conversion:', error);
//     res.status(500).send('An error occurred during image conversion.');
//   }
// };

module.exports = { imageConversionFunctionWithFFmpeg };
// --

// -
// -
// -
// -
// most updated code
app.post('/test', async (req, res, next) => {
  const filePathInput = 'temp-files/giffy.gif';
  const filePathOutput = 'temp-output/converted-giffy.gif';
  const imageName = 'converted-giffy.png';

  const command = new ffmpeg(filePathInput)
    .inputFormat('gif')
    .videoCodec('gif')
    .on('start', () => {
      console.log('message', 'Conversion Started.');
    })
    .on('progress', (progress) => {
      if (progress.percent !== undefined) {
        const progressPercent = progress.percent.toFixed(2);
        console.log(progressPercent);
      }
    })
    .on('end', () => {
      console.log('message', 'Conversion Finished.');
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('An error occurred while handling the FFmpeg error:', err);
        console.error('FFmpeg error: ', stdout);
        console.error('FFmpeg error: ', stderr);
      } catch (error) {
        res.status(500).send('Conversion Error: ' + error);
      }
    });

  res.json({ downloadUrl: filePathOutput, fileName: imageName });
  command.save(filePathOutput);
});