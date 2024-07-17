import React, { useState, useEffect } from 'react';
import { fetchStockData, getStockData } from '../services/api';
import StockSearch from './StockSearch';
import StockView from './StockView';

function StockDashboard() {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStock = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching data for ${symbol}`);
      await fetchStockData(symbol);
      console.log(`Data fetched for ${symbol}, getting stock data`);
      const response = await getStockData(symbol);
      console.log(`Received data for ${symbol}:`, response.data);
      setStocks(prev => ({ ...prev, [symbol]: response.data }));
    } catch (err) {
      console.error(`Error fetching stock data for ${symbol}:`, err);
      setError(`Failed to fetch stock data for ${symbol}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (symbol) => {
    if (!stocks[symbol]) {
      fetchStock(symbol);
    }
  };

  return (
    <div>
      <h1>Stock Dashboard</h1>
      <StockSearch onSearch={handleSearch} />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {Object.entries(stocks).map(([symbol, data]) => (
        <StockView key={symbol} stock={data} />
      ))}
    </div>
  );
}

export default StockDashboard;