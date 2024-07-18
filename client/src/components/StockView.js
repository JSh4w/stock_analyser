import React, { useState, useEffect } from 'react';
import { fetchStockData, getStockData } from '../services/api';

function StockView() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      //const response = await fetchStockData('AAPL');
      const response = await getStockData('AAPL');
      console.log(response.data);
      setStock(response);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stock) return <div>No stock data available</div>;



  return (
    <div>
      <h2>{stock.date}</h2>
      <h2>{stock.name || 'Apple Inc'} ({stock.symbol})</h2>
      <button onClick={fetchData}>Refresh Data</button>
      {stock.data && stock.data.length > 0 ? (
        <ul>
          {stock.data.slice(0, 5).map((item) => (
            <li key={item.date}>
              Date: {formatDate(item.date)}, Close: ${item.close.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available for this stock.</p>
      )}
    </div>
  );
}

export default StockView;