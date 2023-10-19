const ffmpeg = require('fluent-ffmpeg');
const socketIo = require('socket.io');

// functions
const functions = require('../functions/functions');

const fileName = '';

async function uploadAndHandleFile(file, directory, processedFiles) {
  try {
    // Upload the file
    let fileDirectory = directory + file.name;
    await new Promise((resolve, reject) => {
      file.mv(fileDirectory, (err) => {
        if (err) {
          console.error('File Upload Error:', err);
          reject(err);
        } else {
          resolve(fileDirectory);
        }
      });
    });

    // Handle the uploaded file
    processedFiles.push(fileDirectory);
    console.log('File uploaded successfully: ' + fileDirectory);

    return fileDirectory;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// const extractOptionsFromRequest = (req, propertyNames) => {
//   const options = {};

//   for (const propName of propertyNames) {
//     options[propName] = req[propName];
//   }

//   return options;
// };

const extractOptionsFromRequest = (req, fieldNames) => {
  const options = {};

  fieldNames.forEach((fieldName) => {
    options[fieldName] = req[fieldName];
    console.log(`${options[fieldName]}`);
    console.log(`${req[fieldName]}`);
  });

  return options;
};

//
module.exports = {
  // variables
  fileName,

  // functions
  uploadAndHandleFile,
  extractOptionsFromRequest,
};
