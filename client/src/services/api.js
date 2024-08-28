import axios from 'axios';

const API_BASE_URL = '/api/stocks'; // Ensure this matches your backend URL

export const fetchStockData = async (symbol) => {
  try {
    console.log(`Fetching data for ${symbol}`);
    const response = await axios.post(`${API_BASE_URL}/${symbol}/fetch`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error in fetchStockData:', error.response?.data || error.message);
    throw error;
  }
};

export const getStockData = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error in getStockData:', error.response?.data || error.message);
    throw error;
  }
};

export const refreshStockData = async (symbol) => {
  try {
    // const response = await axios.get(`${API_BASE_URL}/${symbol}/refresh`); <- refresh changes data to getandUpdateStocks, 
    // can't debug getting new responses unless I need to give Alpha Vantage my whitelist IP or another API key issues
    // MongoDB is not giving repsonses as it should 
    const response = await axios.post(`${API_BASE_URL}/${symbol}/refresh`);
    return response.data;
  } catch (error) {
    console.error('Error in refreshStockData:', error.response?.data || error.message);
    throw error;
  }
}