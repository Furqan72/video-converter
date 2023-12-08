const express = require('express');
const router = express.Router();

// functions
const { imageConversionFunction } = require('./functions/converterTest');
const { videoConversionFunction } = require('./functions/imageConverterTest');

// post routes
router.post('/image-conversion', imageConversionFunction);
router.post('/video-conversion', videoConversionFunction);

router.get('/test', (req, res) => {
  console.log('working');
  res.status(200).send('API is working!');
});

module.exports = router;
