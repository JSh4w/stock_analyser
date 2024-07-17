import axios from 'axios';

const API_BASE_URL = '/api/stocks'; // Ensure this matches your backend URL

export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${symbol}/fetch`);
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