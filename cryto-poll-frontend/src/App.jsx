import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000/api/v1/crypto"; // Replace with your server endpoint
const coinCodes = ["bitcoin", "ethereum", "grin", "bnb", "solana"];

function App() {
  const [stocks, setStocks] = useState([]);
  const [crypto, setCrypto] = useState("bitcoin");
  const [selectedCrypto, setSelectedCrypto] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${ENDPOINT}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(crypto);
          const finalData = data.data.data;
          setStocks(finalData);
          setSelectedCrypto(finalData.map((data) => data[crypto]));
        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    fetchData(); // Initial fetch

    const id = setInterval(fetchData, 3000); // Fetch data every 5 seconds

    return () => clearInterval(id); // Cleanup interval on unmount
  }, [crypto]);

  function handleCrypto(e) {
    const selectedCoin = e.target.value;
    setCrypto(selectedCoin);
    const data = stocks.map((stock) => stock[selectedCoin]);
    setSelectedCrypto(data);
  }

  return (
    <div className="App">
      <h1>Stocks or Cryptos</h1>
      <select value={crypto} onChange={handleCrypto}>
        {coinCodes.map((coin) => (
          <option key={coin} value={coin}>
            {coin}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Volume</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {selectedCrypto.map((stock, index) => (
            <tr key={index}>
              <td>
                <img src={stock.image} alt={stock.name} />
              </td>
              <td>{stock.usd}</td>
              <td>{stock.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
