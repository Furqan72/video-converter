// app.post('/convert', (req, res) => {
//   let inputFile = req.files.videoFile;
//   let selectMenuValues = req.body.selectMenu;
//   let startingTime = req.body.StartingTime;
//   let endingTime = req.body.EndingTime;

//   io.emit('message', 'File Upload Started');
//   inputFile.mv('temp-files/' + inputFile.name, function (err) {
//     if (err) {
//       io.emit('message', 'File Upload Error: ' + err.message);
//       return res.status(500).send(err);
//     } else {
//       io.emit('message', 'File Uploaded Successfully.');
//     }
//   });

//   const inputPath = `./temp-files/${inputFile.name}`;
//   const lastDotIndex = inputFile.name.lastIndexOf('.');
//   const fileNameWithoutExtension = inputFile.name.substring(0, lastDotIndex);
//   const outputPath = `./temp-output/converted-${fileNameWithoutExtension + selectMenuValues}`;

//   const command = new ffmpeg(inputPath)
//     .on('start', (commandLine) => {
//       console.log('Conversion Started.');
//     })
//     .on('progress', (progress) => {
//       if (progress.percent !== undefined) {
//         console.log('Conversion progress:', progress.percent.toFixed(2) + '%');
//         io.emit('message', 'Conversion Progress: ' + progress.percent.toFixed(2) + '%');
//       }
//     })
//     .on('end', () => {
//       io.emit('message', 'Conversion Finished.');
//       console.log('Conversion finished.');
//       res.download(outputPath, (err) => {
//         if (err) {
//           io.emit('message', 'Download Error: ' + err.message);
//           console.error('Download Error:', err);
//         } else {
//           console.log('Download Complete');
//           // Deleting Output File
//           fs.unlink(outputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Converted file deleted.');

//               res.json({ downloadUrl: outputPath, fileName: fileNameWithoutExtension + selectMenuValues });
//             }
//           });
//           // Deleting Input File
//           fs.unlink(inputPath, (err) => {
//             if (err) {
//               console.error('Error deleting converted file:', err);
//             } else {
//               console.log('Original file deleted.');
//             }
//           });
//         }
//       });
//     })
//     .on('error', (err) => {
//       io.emit('message', 'Conversion Error: ' + err.message);
//       console.error('Error:', err);
//     });

//   if (startingTime && endingTime && endingTime !== '00:00:00') {
//     command.setStartTime(startingTime);
//     command.setDuration(endingTime);
//   }

//   command.save(outputPath);
// });

// --------------------------------------------------------------------------------------------------------------------

// app.delete('/', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = `./temp-output/${filename}`; // Adjust the path as needed

//   // Use fs.unlink to delete the file
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error('Error deleting file:', err);
//       res.status(500).send('Error deleting file');
//     } else {
//       console.log(`File ${filename} deleted successfully.`);
//       res.send(`File ${filename} deleted successfully`);
//     }
//   });
// });

// --------------------------------------------------------------------------------------------------------------------

// <!-- <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Resolution</label>
// <select name="ResolutionMenu" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in resolutionOptions" :key="index" :value="option.value">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Aspect&nbsp;Ratio</label>
// <select name="AspectRatioSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in aspectRatioOptions" :key="index" :value="option.value">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Constant&nbsp;Quality (CRF)</label>
// <select name="ConstantQualitySelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in constantQualityOptions" :key="index" :value="option.value" :selected="option.label === '23 (normal quality)'">{{ option.label }}</option>
// </select>
// </div>
// <div class="text-gray-color grid grid-cols-4 items-center justify-center">
// <label for="">Video&nbsp;Codec</label>
// <select name="videotCodecSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
//   <option v-for="(option, index) in videotCodecOptions" :key="index" :value="option.value" :selected="option.label === 'x264'">{{ option.label }}</option>
// </select>
// </div> -->
