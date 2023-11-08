<!-- <template>
  <div class="h-96 px-40 py-14">hello!</div>
    <img v-if="imageData" class="w-72" :src="imageData" alt="Image Preview" />
</template>

<script setup></script> -->

<!-- <template>
  <div class="h-96 px-40 py-14">
    <input type="file" @change="previewImage" />
    <img v-if="imageData" class="w-72" :src="imageData" alt="Image Preview" />
  </div>
</template> -->

<template>
  <div class="h-96 px-40 py-14">
    <!-- <button class="text-white" @click="incrementNumber">Increment Number</button> -->
    <div id="nbr">{{ number }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const number = ref(24);
const speed = 50;

// const incrementNumber = () => {
//   incrementNumberRecursive(0, number.value);
// };

const incrementNumberRecursive = (i, endNbr) => {
  if (i <= endNbr) {
    number.value = i;
    setTimeout(() => {
      incrementNumberRecursive(i + 1, endNbr);
    }, speed);
  }
};

onMounted(() => {
  incrementNumberRecursive(0, number.value);
});
</script>

<script>
// import { ref } from 'vue';
// import Image from 'image-js';

// const imageData = ref(null);

// const convertFileToBuffer = (file) => {
//   return file.arrayBuffer().then((arrayBuffer) => new Uint8Array(arrayBuffer));
// };

// const previewImage = async (event) => {
//   const file = event.target.files[0];

// if (file) {
//   if (file.type === 'image/tiff') {
//     try {
// const buffer = await convertFileToBuffer(file);
// const tiffData = await Image.load(buffer);
// const imageDataURL = tiffData.toDataURL('image/png');
// imageData.value = imageDataURL;
// } catch (error) {
//   console.error(error);
//   imageData.value = null;
//   alert('Error converting TIFF image.');
// }
// } else if (file.type === 'image/heic') {
// imageData.value = null;
//   alert('HEIC image format is not supported.');
// } else {
//   imageData.value = null;
//   alert('Unsupported image format. Please select a TIFF or HEIC file.');
// }
// }
// };

// const { imageData, previewImage } = useSetup();
</script>

<!--        node code      -->
<!-- // const sharp = require('sharp');
// const socketIo = require('socket.io');
// const fs = require('fs');

// const { promisify } = require('util');
// const unlinkAsync = promisify(fs.unlink);

// // functions
// const globalFunctions = require('../global/globalFunctions');
// const functions = require('../functions/functions');

// // Extracting Options From Request
// const extractOptionsFromRequest = (req) => {
//   const options = {};

//   options.inputFile = req.files.uploadFile;
//   options.selectMenuValues = req.body.selectMenu;
//   options.fileWidth = req.body.width;
//   options.fileHeight = req.body.height;
//   options.fitValue = req.body.fit;
//   options.stripValue = req.body.strip;
//   options.orientValue = req.body.orient;
//   options.qualityValue = req.body.quality;
//   console.log(options);

//   return options;
// };

// // configure Sharp Events => progress
// const configureSharpEvents = async (sharpStream, options, io) => {
//   let processedBytes = 0;
//   let extractedText = '';
//   const total = options.inputFile.size;

//   sharpStream
//     .on('data', (chunk) => {
//       if (chunk !== undefined) {
//         console.log('Received data chunk: ', chunk.length);
//         console.log('Received total: ', total);
//         processedBytes += chunk.length;
//         const progressPercent = ((processedBytes / total) * 100).toFixed(2);
//         console.log(progressPercent);
//         io.emit('progress', progressPercent);
//       }
//     })
//     .on('end', () => {
//       if (extractedText === '') {
//         const progressPercent = 100;
//         io.emit('progress', progressPercent);
//         console.log(progressPercent);
//         console.log('Conversion Finished.');
//         io.emit('endConversion');
//       } else {
//         console.log('conversion Failed!!!!!');
//         return;
//       }
//     })
//     .on('error', (err, chunk, info) => {
//       try {
 //         console.error('Info data  --- ', info); // console.error('Chunk data --- ', chunk); // console.error('Error:', err); // io.emit('error', err.message); // const errorPatterns = /(Unsupported codec|unsupported image format|unable to)/; // const match = err.message.match(errorPatterns); // if (match) { // extractedText = match[0]; // console.log('Extracted-Text ----------- ', extractedText); // io.emit('message', extractedText + ' Conversion failed!!'); // console.log('Conversion Error: ' + err.message); // } // } catch (error) { // console.error('An error occurred while handling the Sharp conversion error:', error); // } // }); // }; // // sharp metadata function // const configureMetadataUsingSharp = async (path) => { // let [errorMessages, completeData] = ['', null]; // try { // completeData = await sharp(path).metadata(); // let imageWidth = completeData.width; // let frames = completeData.frameCount; // console.log('Frames ==> ' + frames); // console.log('address in the sharp metadata function ---- ' + path); // } catch (err) { // errorMessages = 'Error getting image metadata'; // } // return { errorMessages, completeData }; // }; // const processedImages = []; // // const uploadAndHandleFile = async (file, uploadDir) => { // // try { // // const filePath = `${uploadDir}${file.name}`; // // if (!fs.existsSync(filePath)) { // // deleteProcessedFiles(); // // await file.mv(filePath); // // } // // return filePath; // // } catch (error) { // // throw new Error(`Error uploading or moving the file: ${error.message}`); // // } // // }; // const uploadAndHandleFile = async (file, directory) => { // return new Promise((resolve, reject) => { // const fileDirectory = directory + file; // file.mv(fileDirectory, (err) => { // if (err) { // console.error('File Upload Error:', err); // reject(err); // } else { // resolve(fileDirectory); // } // }); // }); // }; // const deleteProcessedFiles = async () => { // console.log('processedFiles -> ' + processedImages); // const filesToDelete = []; // for (const file of processedImages) { // try { // fs.unlinkSync(file); // console.log(`Deleted file: ${file}`); // } catch (err) { // console.error('Error', err); // // If there was an error deleting the file, keep it in the list // filesToDelete.push(file); // } // } // // Update the processedImages array with the files that were not deleted // processedImages = filesToDelete; // console.log('Remaining Files in the Arr => ' + processedImages.join(', ') + ' .'); // }; // // Handle File Deletion // // const deleteProcessedFiles = async () => { // // try { // // for (const file of processedImages) { // // await unlinkAsync(file); // // console.log('Deleted file:', file); // // } // // processedImages.length = 0; // // } catch (error) { // // console.error('Error deleting files:', error); // // } // // }; // const configureEditingOptions = async (command, options, metadata) => { // // width x height // fit= max, scale or crop // if (options.fileWidth &&
options.fileHeight) { // command.resize(Number(options.fileWidth), Number(options.fileHeight), { fit: options.fitValue }); // } // // removing EXIF data // if (options.stripValue === 'yes') { // command.withMetadata(false); // } // // automatically rotate the image correctly, based on EXIF information // if (options.orientValue === 'yes') { // command.rotate(); // } // // animation for gif image // if (options.inputFile.name.endsWith('.gif') && options.selectMenuValues === '.gif') { // command.toFormat('gif'); // } // // transparent background // if (metadata.hasAlpha && !(options.inputFile.name.endsWith('.gif') && options.selectMenuValues === '.gif')) { // command.toFormat('png'); // } // }; // // video conversion function with sharp // const imageConversionFunctionWithSharp = async (req, res, io) => { // io.emit('startConversion'); // // deleteProcessedFiles(); // const editingoptions = extractOptionsFromRequest(req); // try { // const inputPath = await uploadAndHandleFile(editingoptions.inputFile, 'temp-files/'); // // const inputPath = await uploadAndHandleFile(editingoptions.inputFile, 'temp-files/'); // processedImages.push(inputPath); // const lastDotIndex = editingoptions.inputFile.name.lastIndexOf('.'); // const fileNameWithoutExtension = editingoptions.inputFile.name.substring(0, lastDotIndex); // const outputPath = `./temp-output/converted-${fileNameWithoutExtension + editingoptions.selectMenuValues}`; // globalFunctions.fileName = fileNameWithoutExtension + editingoptions.selectMenuValues; // processedImages.push(outputPath); // let sharpCommand; // if (editingoptions.inputFile.name.endsWith('.gif') && editingoptions.selectMenuValues === '.gif') { // sharpCommand = sharp(inputPath, { animated: true }); // } else { // sharpCommand = sharp(inputPath); // } // configureSharpEvents(sharpCommand, editingoptions, io); // const { errorMessages, completeData } = await configureMetadataUsingSharp(inputPath); // res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + editingoptions.selectMenuValues, message: errorMessages, fullVideoData: completeData }); // if (errorMessages !== '') { // io.emit('error', errorMessages); // return; // } // configureEditingOptions(sharpCommand, editingoptions, completeData); // sharpCommand.toFile(outputPath, async (err, info) => { // if (err) { // console.log('File conversion error:', info); // console.error('Error converting file:', err); // } else { // console.log('File converted: >>>>>> ', outputPath); // } // }); // processedImages.push(inputPath); // console.log(processedImages); // } catch (error) { // console.error('An error occurred in the last try catch:', error); // } // }; // module.exports = { imageConversionFunctionWithSharp }; -->
-->
