const dotenv = require('dotenv');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const http = require('http');
const socketIo = require('socket.io');
const { Crypto } = require('./models/cryptoPoller');

// Configure variables from config.env file
dotenv.config({ path: './config.env' });

const app = require('./app');
const { fetchCryptoData } = require('./models/cryptoPoller.js');
const server = http.createServer(app);

const io = socketIo(server);

const url = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });
// io.on('connection', socket => {
//   console.log('Client connected');

//   // Example: Emit updates when new data arrives
//   Crypto.watch().on('change', async change => {
//     if (change.operationType === 'insert') {
//       const newStock = await Crypto.find({});
//       socket.emit('stockUpdate', newStock);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });
const port = process.env.PORT || 3000;
const POLL_INTERVAL = process.env.POLL_INTERVAL || '*/3 * * * * *';

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// schedule.scheduleJob(POLL_INTERVAL, fetchCryptoData);

// Test job to print to console every 3 seconds
schedule.scheduleJob('*/3 * * * * *', () => {
  fetchCryptoData();
});
