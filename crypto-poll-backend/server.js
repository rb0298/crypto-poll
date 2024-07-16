const dotenv = require('dotenv');
const mongoose = require('mongoose');
const schedule = require('node-schedule');

// Configure variables from config.env file
dotenv.config({ path: './config.env' });

const app = require('./app');
const { fetchCryptoData } = require('./models/cryptoPoller.js');

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Test job to print to console every 3 seconds
schedule.scheduleJob('*/3 * * * * *', () => {
  fetchCryptoData();
});
