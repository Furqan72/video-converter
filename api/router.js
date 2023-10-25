const express = require('express');
const router = express.Router();

const { videoConversionFunction } = require('./functions/converter');
const { videoConversionFunctionWithSharp } = require('./functions/imageConverter');

function handleConversionRoute(req, res, conversionFunction) {
  if (typeof conversionFunction === 'function') {
    conversionFunction(req, res, req.io);
  } else {
    console.log('Error getting conversion function');
    res.status(500).send('Internal Server Error: No conversion processed.');
  }
}

// video route
router.post('/convert', (req, res) => {
  console.log('1');
  handleConversionRoute(req, res, videoConversionFunction);
});

// image route
router.post('/image-convert', (req, res) => {
  console.log('2');
  handleConversionRoute(req, res, videoConversionFunctionWithSharp);
});

module.exports = router;
