import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStockBySymbol, fetchStockData } from '../services/api';
import StockChart from './StockChart';

function StockDetails() {
  const [stock, setStock] = useState(null);
  const { symbol } = useParams();

  useEffect(() => {
    getStockBySymbol(symbol).then(response => setStock(response.data));
  }, [symbol]);

  const handleRefresh = () => {
    fetchStockData(symbol).then(response => setStock(response.data));
  };

  if (!stock) return <div>Loading...</div>;

  return (
    <div>
      <h2>{stock.name} ({stock.symbol})</h2>
      <button onClick={handleRefresh}>Refresh Data</button>
      <StockChart data={stock.data} />
      {/* Add more details as needed */}
    </div>
  );
}

export default StockDetails;