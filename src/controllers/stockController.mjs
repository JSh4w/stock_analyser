// stockController.js

import Stock from '../models/Stock.mjs';
import * as alphaVantageApi from '../services/alphaVantageAPI.mjs';

/**
 * Create a new stock
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const createStock = async (req, res) => {
  const stock = new Stock({
    symbol: req.body.symbol,
    name: req.body.name,
  });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update an existing stock
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findOneAndUpdate(
      { symbol: req.params.symbol },
      { $set: req.body },
      { new: true }
    );

    if (updatedStock) {
      res.json(updatedStock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a stock
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findOneAndDelete({ symbol: req.params.symbol });
    if (deletedStock) {
      res.json({ message: 'Stock deleted' });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch and update stock data
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const fetchAndUpdateStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await alphaVantageApi.fetchStockData(symbol);
    
    const timeSeriesData = data['Time Series (Daily)'];
    const processedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date: new Date(date),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseFloat(values['5. volume']),
    }));

    await Stock.findOneAndUpdate(
      { symbol },
      {
        symbol,
        name: data['Meta Data']['2. Symbol'],
        data: processedData,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Stock data updated successfully' });

  } catch (error) {
    console.error('Error updating stock data:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get stock data
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol });
    if (stock) {
      res.json({
        symbol: stock.symbol,
        name: stock.name,
        data: stock.data
      });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
};

/**
 * Search stocks
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    const stocks = await Stock.find({
      $or: [
        { symbol: new RegExp(query, 'i') },
        { name: new RegExp(query, 'i') }
      ]
    }).select('symbol name');
    
    res.json(stocks);
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ message: 'Error searching stocks' });
  }
};

/**
 * Get and update stock data
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getAndUpdateStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    let stock = await Stock.findOne({ symbol });
  
    if (!stock) {
      stock = new Stock({ symbol, name: symbol, data: [] });
    }
    
    const latestData = await alphaVantageApi.fetchStockData(symbol);
    
    const timeSeriesData = latestData['Time Series (Daily)'];
    const newData = Object.entries(timeSeriesData)
      .slice(0, 20)
      .map(([date, values]) => ({
        date: new Date(date),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume']),
      }));
    
    const existingDates = new Set(stock.data.map(item => item.date.toISOString().split('T')[0]));
    const updatedData = [
      ...newData.filter(item => !existingDates.has(item.date.toISOString().split('T')[0])),
      ...stock.data
    ].sort((a, b) => b.date - a.date);
    
    stock.data = updatedData;
    stock.lastUpdated = new Date();
    await stock.save();

    res.json({
      symbol: stock.symbol,
      name: stock.name,
      data: stock.data.slice(0, 20),
      lastUpdated: stock.lastUpdated
    });

  } catch (error) {
    console.error('Error updating stock data:', error);
    res.status(500).json({ message: error.message });
  }
};

// Placeholder functions
export const analyzeWithKalmanFilter = async (req, res) => {
  res.status(501).json({ message: 'Kalman filter analysis not implemented yet' });
};

export const analyzeWithGPT = async (req, res) => {
  res.status(501).json({ message: 'GPT analysis not implemented yet' });
};