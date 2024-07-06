const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// CRUD operations
router.get('/', stockController.getAllStocks);
router.get('/:symbol', stockController.getStockBySymbol);
router.post('/', stockController.createStock);
router.put('/:symbol', stockController.updateStock);
router.delete('/:symbol', stockController.deleteStock);

// Data fetching and analysis
router.post('/:symbol/fetch', stockController.fetchAndUpdateStockData);
router.get('/:symbol/analyze/kalman', stockController.analyzeWithKalmanFilter);
router.get('/:symbol/analyze/gpt', stockController.analyzeWithGPT);

module.exports = router;