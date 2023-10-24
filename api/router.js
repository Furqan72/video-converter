const express = require('express');
const router = express.Router();

const { videoConversionFunction } = require('./functions/converter');
// const { imageConversionFunction } = require('./functions/imageConverter');
const { videoConversionFunctionWithSharp } = require('./functions/imageConverter');

// router.post('/convert', (req, res) => {
//   if (typeof videoConversionFunction === 'function') {
//     videoConversionFunction(req, res, req.io);
//   } else {
//     console.log('error getting videoConversion Function');
//     res.status(500).send('Internal Server Error: No conversion processed.');
//     // res.status(500).send('Internal Server Error: videoConversionFunction is not defined.');
//   }
// });

// router.post('/image-convert', (req, res) => {
//   if (typeof videoConversionFunctionWithSharp === 'function') {
//     videoConversionFunctionWithSharp(req, res, req.io);
//   } else {
//     console.log('error getting videoConversion Function');
//     res.status(500).send('Internal Server Error: No conversion processed.');
//     // res.status(500).send('Internal Server Error: videoConversionFunction is not defined.');
//   }
// });

function handleConversionRoute(req, res, conversionFunction) {
  if (typeof conversionFunction === 'function') {
    conversionFunction(req, res, req.io);
  } else {
    console.log('Error getting conversion function');
    res.status(500).send('Internal Server Error: No conversion processed.');
  }
}

router.post('/convert', (req, res) => {
  console.log('1');
  handleConversionRoute(req, res, videoConversionFunction);
});

router.post('/image-convert', (req, res) => {
  console.log('2');
  handleConversionRoute(req, res, videoConversionFunctionWithSharp);
});

module.exports = router;
