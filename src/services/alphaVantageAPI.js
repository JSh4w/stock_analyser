const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.ALPHAVANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const fetchStockData = async (symbol) => {
  try {
    console.log(`Fetching data for ${symbol}...`);
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'compact',
        apikey: API_KEY
      }
    });
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchStockData }