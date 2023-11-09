const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// routes
const router = require('./router');
// Global Functions
const globalFunctions = require('./global/globalFunctions');

const app = express();
const server = http.createServer(app);

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

app.use(cors(AllowedDomains));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);

app.use(
  '/temp-output',
  (req, res, next) => {
    const fileName = `${globalFunctions.fileName}`;
    const disposition = `attachment; filename="${fileName}"`;
    res.setHeader('Content-Disposition', disposition);

    next();
  },
  express.static('temp-output')
);

app.use((req, res, next) => {
  next();
});

// router
app.use('/', router);

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
