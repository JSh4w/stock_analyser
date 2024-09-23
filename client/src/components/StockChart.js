import { fetchStockData, getStockData } from '../services/api';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Function to fetch stock data either from the database or API,
 * handle errors, and update state accordingly.
 *
 * @return {Promise<void>} Promise that resolves when data is fetched and state is updated.
 */
function StockChart() {
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    /**
     * Function to fetch stock data either from the database or API,
     * handle errors, and update state accordingly.
     *
     * @return {Promise<void>} Promise that resolves when data is fetched and state is updated.
     */
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!stock) return <div>No stock data available</div>;
  

    const data = {
        labels: stock.data.slice(0, 100).map((d) => new Date(d.date)),
        datasets: [
          {
            label: 'Stock Price',
            data: stock.data.slice(0, 100).map((d) => ({ x: new Date(d.date), y: d.close })),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Stock Price Over Time'
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      };

    return (
        <div style={{ width: '600px', height: '400px' }}>
          <Line data={data} options={options} />
          <p>Last updated: {new Date(stock.data[0].date).toLocaleDateString()}</p>
        </div>
    ); 
};

    
    export default StockChart;