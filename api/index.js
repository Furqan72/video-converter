const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// routes
const router = require('./router');
// Global Functions
const globalFunctions = require('./global/globalFunctions');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://video-converter2.vercel.app '],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
  },
});

const AllowedDomains = {
  origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// const AllowedDomains = {
//   origin: ['http://localhost:5173', 'https://video-converter2.vercel.app'],
//   optionsSuccessStatus: 200,
// };

app.use(cors(AllowedDomains));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp-files/',
  })
);

// app.use('/temp-output', express.static('temp-output'));

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
  req.io = io;
  next();
});

// router
app.use('/', router);

// io.on('connection', (socket) => {
//   // console.log('User connected');

//   socket.on('startConversion', () => {
//     console.log('User has started Conversion.');
//   });

//   socket.on('endConversion', () => {
//     console.log('User has completed the conversion...1');
//   });

//   socket.on('disconnectUser', () => {
//     socket.disconnect();
//     console.log('User has  disconnected.');
//   });
// });

server.listen(4000, () => {
  console.log('server running on 4000 port');
});
