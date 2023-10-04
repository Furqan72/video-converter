const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// file upload function
function uploadFile(file, directory) {
  return new Promise((resolve, reject) => {
    let fileDirectory = directory + file.name;

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

// delete function
const processedFiles = [];
const deleteProcessedFiles = () => {
  if (processedFiles.length > 0) {
    processedFiles.forEach((file) => {
      fs.unlink(file, (err) => {
        if (err) {
          console.error('Error');
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  } else {
    console.log('array is empty -> ' + processedFiles);
  }
};

// getting video metadata
function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        // console.log(metadata);
        resolve(metadata);
      }
    });
  });
}

// calcualting time for trim

// converting HH:MM:SS to Seconds
function parseTime(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// returning the time in the format => HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes}:${remainingSeconds}`;
}

// calculating end-time
function calculateDuration(startTime, endTime) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const durationInSeconds = end - start;
  return formatTime(durationInSeconds);
}

// checking values for Fit (in video options)
function createComplexVideoFilter(fitValue, widthValue, heightValue, aspectRatio) {
  let complexFilter = [];

  switch (fitValue) {
    case 'scale':
      console.log('scale');
      complexFilter.push(`scale=${widthValue}:${heightValue}`);
      break;
    case 'max':
      console.log('max');
      complexFilter.push(`scale=w=min(iw\\,${widthValue}):h=min(ih\\,${heightValue}):force_original_aspect_ratio=decrease`);
      break;
    case 'pad':
      console.log('pad');
      complexFilter.push(`scale=w=min(iw\\,${widthValue}):h=min(ih\\,${heightValue}):force_original_aspect_ratio=decrease,pad=${widthValue}:${heightValue}:(ow-iw)/2:(oh-ih)/2`);
      break;
    case 'crop':
      console.log('crop');
      complexFilter.push(`crop=${widthValue}:${heightValue}`);
      break;
    default:
      console.log('error error error error error (error in the createComplexVideoFilter function)');
      break;
  }

  if (aspectRatio !== 'no change') {
    complexFilter.push(`setdar=${aspectRatio}`);
    console.log('aspect ---------------------------- ' + aspectRatio);
  }

  return complexFilter;
}

module.exports = {
  processedFiles,

  // functions
  uploadFile,
  deleteProcessedFiles,
  getVideoMetadata,
  parseTime,
  formatTime,
  calculateDuration,
  createComplexVideoFilter,
};
