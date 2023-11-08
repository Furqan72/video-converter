const express = require('express');
const router = express.Router();

const { videoConversionFunction } = require('./functions/converter');
const { imageConversionFunctionWithSharp } = require('./functions/imageConverter');

function handleConversionRoute(req, res, conversionFunction) {
  if (typeof conversionFunction === 'function') {
    // conversionFunction(req, res, req.io);
    conversionFunction(req, res);
  } else {
    console.log('Error getting conversion function');
    res.status(500).send('Error getting conversion function: no route found to process the file.');
  }
}

// video route
router.post('/video-convert', (req, res) => {
  console.log('1  -->  video-convert');
  handleConversionRoute(req, res, videoConversionFunction);
});

// image route
router.post('/image-convert', (req, res) => {
  console.log('2  -->  image-convert');
  handleConversionRoute(req, res, imageConversionFunctionWithSharp);
});

module.exports = router;
