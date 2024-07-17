// src/components/StockList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAllStocks()
      .then(response => {
        setStocks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch stocks');
        setLoading(false);
        console.error('Error fetching stocks:', err);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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