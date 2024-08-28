// StockDataController.js

import StockData from '../models/Stock.mjs'; // Adjust path as needed
import * as kalmanFilterService from '../services/kalmanFilterService.mjs';

class StockDataController {
  async applyKalmanFilter(req, res) {
    try {
      const { stockData } = req.body;
      const filteredData = kalmanFilterService.processStockData(stockData);
      res.json({ filteredData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to apply Kalman filter to provided data' });
    }
  }
}

export default new StockDataController();