const StockData = require('../models/Stock'); // Adjust path as needed
const kalmanFilterService = require('../services/kalmanFilterService');

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

module.exports = new StockDataController();