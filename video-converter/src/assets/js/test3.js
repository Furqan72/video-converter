// if (imageWatermark) {
//       const watermarkPath = `./temp-files/${imageWatermark.name}`;
//       imageWatermark.mv(watermarkPath, (err) => {
//         if (err) {
//           errorMessage = 'Error saving watermark image.';
//           return res.status(500).json({ error: errorMessage });
//         }

//         // Add watermark filter to the command
//         command.complexFilter(`[0:v]scale=${widthValue}:${heightValue}[main];[1:v]scale=w=iw/4:h=ih/4[watermark];[main][watermark]overlay=W-w-10:H-h-10`);
//         command.input(watermarkPath);

//         // Save the output video with watermark
//         command.save(outputPath, (err, stdout, stderr) => {
//           if (err) {
//             // io.emit('message', 'Conversion Error: ' + err.message);
//             return res.status(500).json({ error: 'Conversion Error: ' + err.message });
//           }

//           // Remove the temporary watermark file
//           fs.unlinkSync(watermarkPath);

//         });
//       });
//     } else {

// Watermark Handling
// if (imageWatermark) {
//   const watermarkFilter = `movie=${imageWatermarkPath} [watermark]; [0:v][watermark] overlay=(W-w)/2:(H-h)/2`;

//   if (resolution === 'no change') {
//     command.complexFilter([watermarkFilter]);
//   } else {
//     command.complexFilter([watermarkFilter]);
//   }
// }

// command.complexFilter([`[0:v]scale=${widthValue}:${heightValue}[main];`, `[1:v]scale=w=iw/4:h=ih/4[watermark];`, '[main][watermark]overlay=W-w-10:H-h-10']);
// command.complexFilter(`[0:v]scale=960:720;overlay=1500:1000`);
// command.input(watermarkPath);
// command
//   .inputOptions([`-map 1:v`])
