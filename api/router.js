const express = require('express');
const router = express.Router();

const { videoConversionFunction } = require('./functions/converter');
const { imageConversionFunctionWithSharp } = require('./functions/imageConverter');

async function handleConversionRoute(req, res, conversionFunction) {
  try {
    if (typeof conversionFunction === 'function') {
      await conversionFunction(req, res);
    }
  } catch (error) {
    console.log('Error getting conversion function');
    res.status(500).send('Error getting conversion function: no route found to process the file: ' + error);
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
