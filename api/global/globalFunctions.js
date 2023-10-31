const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');

// functions
const functions = require('../functions/functions');

const fileName = '';
async function uploadAndHandleFile(file, directory) {
  const fileDirectory = directory + file.name;

  try {
    await file.mv(fileDirectory);
    functions.processedFiles.push(fileDirectory);
    return fileDirectory;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

const extractOptionsFromRequest = (req, fieldNames) => {
  const options = {};

  fieldNames.forEach((fieldName) => {
    options[fieldName] = req[fieldName];
    console.log(`${options[fieldName]}`);
    console.log(`${req[fieldName]}`);
  });

  return options;
};

module.exports = {
  // variables
  fileName,

  // functions
  uploadAndHandleFile,
  extractOptionsFromRequest,
};
