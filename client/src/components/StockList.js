import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStocks } from '../services/api';

function StockList() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getAllStocks().then(response => setStocks(response.data));
  }, []);

  return (
    <div>
      <h2>Stocks</h2>
      <ul>
        {stocks.map(stock => (
          <li key={stock.symbol}>
            <Link to={`/stock/${stock.symbol}`}>{stock.name} ({stock.symbol})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockList;