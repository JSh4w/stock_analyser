import axios from 'axios';

const API_URL = '/api/stocks';

export const getAllStocks = () => axios.get(API_URL);
export const getStockBySymbol = (symbol) => axios.get(`${API_URL}/${symbol}`);
export const fetchStockData = (symbol) => axios.post(`${API_URL}/${symbol}/fetch`);