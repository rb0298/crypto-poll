// src/cryptoPoller.js
const mongoose = require('mongoose');
const obj = {
  usd: Number,
  image: String,
  symbol: String,
  volume: Number,
  code: String
};

const cryptoSchema = new mongoose.Schema({
  bitcoin: obj,
  ethereum: obj,
  bnb: obj,
  solana: obj,
  grin: obj,
  timestamp: { type: Date, default: Date.now }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
exports.fetchCryptoData = async () => {
  try {
    const response = await fetch(
      new Request('https://api.livecoinwatch.com/coins/map'),
      {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          'x-api-key': process.env.CRYPTO_API_KEY
        }),
        body: JSON.stringify({
          codes: ['ETH', 'BTC', 'GRIN', 'SOL', 'BNB'],
          currency: 'USD',
          sort: 'rank',
          order: 'ascending',
          offset: 0,
          limit: 0,
          meta: true
        })
      }
    );

    const data = await response.json();
    const coinCodes = ['BTC', 'ETH', 'GRIN', 'BNB', 'SOL'];
    const cryptoData = {
      timestamp: new Date()
    };

    coinCodes.forEach(code => {
      const coin = data.find(coin => coin.code === code);
      cryptoData[coin.name.toLowerCase()] = {
        usd: coin.rate,
        image: coin.png64,
        volume: coin.volume,
        symbol: coin.symbol,
        code: coin.code
      };
    });

    await Crypto.create(cryptoData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

exports.Crypto = Crypto;
