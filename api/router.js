const express = require('express');
const router = express.Router();

const { videoConversionFunction } = require('./functions/converter');

router.post('/convert', (req, res) => {
  if (typeof videoConversionFunction === 'function') {
    videoConversionFunction(req, res, req.io);
  } else {
    console.log('error getting videoConversion Function');
    res.status(500).send('Internal Server Error: No conversion processed.');
    // res.status(500).send('Internal Server Error: videoConversionFunction is not defined.');
  }
});

module.exports = router;
