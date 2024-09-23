import React, { useState, useEffect } from 'react';
import { refreshStockData, fetchStockData, getStockData, analyzeWithKalmanFilter } from '../services/api';

function StockView() {
  const [stock, setStock] = useState(null);
  const [kalmanData, setKalmanData] = useState(null);
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
        const kalmanAnalysis = await analyzeWithKalmanFilter('AAPL', 1);
        setKalmanData(kalmanAnalysis);
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
        const kalmanAnalysis = await analyzeWithKalmanFilter('AAPL', 1);
        setKalmanData(kalmanAnalysis);
      } catch (webError) {
        console.error('Failed to fetch data from API:', webError);
        setError('Failed to fetch stock data');
      }
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await refreshStockData('AAPL');
      setStock(response);
      const kalmanAnalysis = await analyzeWithKalmanFilter('AAPL', 1);
      setKalmanData(kalmanAnalysis);
    } catch (error) {
      console.error('Failed to refresh stock data:', error);
      setError('Failed to refresh stock data');
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
  if (!kalmanData) return <div>No kalman filter data available</div>;


  return (
    <div>
      <h2>{stock.date}</h2>
      <h2>{stock.name || 'Apple Inc'} ({stock.symbol})</h2>
      <button onClick={handleRefresh} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button> 
      <p>Last updated: {formatDate(stock.lastUpdated)}</p>
      {stock.data && stock.data.length > 0 ? (
        <ul>
          {stock.data.slice(0, 20).map((item) => (
            <li key={item.date}>
              Date: {formatDate(item.date)}, Close: ${item.close.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available for this stock.</p>
      )}

      <h3>Kalman Filter Analysis</h3>
      {kalmanData.historicalData && kalmanData.historicalData.length > 0 ? (
        <div>
          <h4>Filtered Historical Data</h4>
          <ul>
            {kalmanData.historicalData.slice(0, 20).map((item) => (
              <li key={item.date}>
                Date: {formatDate(item.date)}, Original: ${item.original.toFixed(2)}, Filtered: ${item.filtered.toFixed(2)}
              </li>
            ))}
          </ul>
          
          <h4>Predictions</h4>
          <ul>
            {kalmanData.predictions.map((item) => (
              <li key={item.date}>
                Date: {formatDate(item.date)}, Predicted: ${item.filtered.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No Kalman filter analysis available for this stock.</p>
      )}
    </div>
  );
}

export default StockView;