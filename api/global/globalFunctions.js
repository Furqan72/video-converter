const ffmpeg = require('fluent-ffmpeg');
// const socketIo = require('socket.io');
const fs = require('fs');

const fsPromises = require('fs').promises;

// functions
const functions = require('../functions/functions');

const fileName = '';
// async function uploadAndHandleFile(file, directory) {
//   return new Promise((resolve, reject) => {
//     const fileDirectory = directory + file;

//     file.mv(fileDirectory, (err) => {
//       if (err) {
//         console.error('File Upload Error:', err);
//         reject(err);
//       } else {
//         resolve(fileDirectory);
//       }
//     });
//   });
// }

async function uploadAndHandleFile(file, directory) {
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
