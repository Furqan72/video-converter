const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');

// functions
const globalFunctions = require('../global/globalFunctions');
const functions = require('../functions/functions');

// Extracting Options From Request
const extractOptionsFromRequest = (req) => {
  const options = {};

  options.inputFile = req.files.videoFile;
  console.log(options.inputFile);

  options.selectForFile = req.body.ConvertFromSelect;
  options.selectMenuValues = req.body.selectMenu;
  options.selectForFile = req.body.width;
  options.selectForFile = req.body.height;
  options.selectForFile = req.body.fit;
  options.selectForFile = req.body.strip;

  return options;
};

// Video Conversion FFmepg events
const configureFFmpegEvents = (command, io, res) => {
  command
    .on('start', () => {
      console.log('message', 'Conversion Started.');
    })
    .on('progress', (progress) => {
      if (progress.percent !== undefined) {
        const progressPercent = progress.percent.toFixed(2);
        io.emit('progress', progressPercent);
        console.log(progressPercent);
      }
    })
    .on('end', () => {
      const progressPercent = 100;
      io.emit('progress', progressPercent);
      console.log('message', 'Conversion Finished.');
    })
    .on('error', (err, stdout, stderr) => {
      try {
        console.error('Error:', err);
        console.error('FFmpeg stderr:', stderr);
        console.error('FFmpeg stdout:', stdout);

        const errorLines = stderr.split('\n');
        const errorPatterns = /(Could not find|width not|compatible)/;
        const errorMessages = errorLines.filter((line) => errorPatterns.test(line));

        let extractedText = '';
        errorMessages.forEach((errorMessage) => {
          const indexOfClosingBracket = errorMessage.indexOf(']');
          if (indexOfClosingBracket !== -1) {
            extractedText = errorMessage.substring(indexOfClosingBracket + 1).trim();
          }
        });
        console.log('Error  -----------  ', extractedText);

        io.emit('message', extractedText + ' Conversion failed!!');
        res.status(500).send('Conversion Error: ' + err.message);
      } catch (error) {
        console.error('An error occurred while handling the FFmpeg error:', error);
      }
    });
};

// Trimming
const configureTrimming = async (path) => {
  let [errorMessages, completeData] = ['', ''];

  try {
    const metadata = await functions.getVideoMetadata(path);
    completeData = metadata; // all metadata
  } catch (err) {
    console.log('not working');
    errorMessages = 'Error retrieving video metadata. Please try again or upload another file.';
  }

  return { errorMessages, completeData };
};

// video conversion function
const imageConversionFunction = async (req, res, io) => {
  // deleting previous converted files
  functions.deleteProcessedFiles();

  // values from the from
  const editingoptions = extractOptionsFromRequest(req);
  try {
    // Upload input file
    const inputPath = await globalFunctions.uploadAndHandleFile(editingoptions.inputFile, 'temp-files/', functions.processedFiles);

    const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.');
    const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex);
    const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`;
    globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues;
    console.log(globalFunctions.fileName);
    functions.processedFiles.push(outputPath);

    const command = new ffmpeg(inputPath);

    // FFmpeg --> start,progress,end,error
    configureFFmpegEvents(command, io, res);

    // Trimming Configuration
    const { errorMessages, completeData } = await configureTrimming(inputPath);
    res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData });
    // error
    if (errorMessages !== '') {
      console.log('Error while trimming the video..........' + errorMessages);
      io.emit('error', errorMessages);
      return;
    }

    command.save(outputPath);

    // Handle any unexpected errors
  } catch (error) {
    console.error('An error occurred in the last try catch:', error);
    res.status(500).send('An error occurred during video conversion.');
  }
};

module.exports = { imageConversionFunction };
