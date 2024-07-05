//Axios is a library used to fetch data from an API
const axios = require('axios');

//Reqeuires Alpha Vantage account setup!!!!
async function fetchStockData(symbol) {
  const API_KEY = process.env.ALPHAVANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    // Process and return the data as needed
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

module.exports = { fetchStockData };