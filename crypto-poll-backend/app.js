const express = require('express');
const cors = require('cors');
const { Crypto } = require('./models/cryptoPoller');

const app = express();

const options = {
  sort: { timestamp: -1 }, // Sort by timestamp in descending order
  limit: 20 // Limit to the most recent 20 entries
};
app.use(cors());
app.get('/api/v1/crypto', async (req, res) => {
  try {
    const data = await Crypto.find({}, null, options);
    console.log(data);

    res.status(200).json({
      status: 'success',
      data: {
        records: data.length,
        data
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'failure to access the data'
    });
  }
});

module.exports = app;
