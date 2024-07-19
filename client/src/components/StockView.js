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
      // Attempt to get the stock data from the database first
      const dbResponse = await getStockData('AAPL');
      if (dbResponse) {
        console.log('Data fetched from database:', dbResponse.data);
        setStock(dbResponse);
      } else {
        throw new Error('Data not found in database');
      }
    } catch (dbError) {
      console.warn('Failed to fetch data from database:', dbError);
      // If the data was not found in the database, fetch it from the API
      try {
        const webResponse = await fetchStockData('AAPL');
        console.log('Data fetched from API:', webResponse.data);
        setStock(webResponse);
      } catch (webError) {
        console.error('Failed to fetch data from API:', webError);
        setError('Failed to fetch stock data');
      }
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
          {stock.data.map((item) => (
            <li key={item.date}>
              Date: {formatDate(item.date)},  Close: ${item.close.toFixed(2)},  Open: ${item.open.toFixed(2)}
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