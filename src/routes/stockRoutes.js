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

 
// Add validation middleware
const { body, param, validationResult } = require('express-validator');

router.post('/', [
  body('symbol').isString().isLength({ min: 1, max: 10 }),
  body('name').isString().isLength({ min: 1, max: 100 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, stockController.createStock);

module.exports = router;