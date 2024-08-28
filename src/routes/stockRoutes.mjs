import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as stockController from '../controllers/stockController.mjs';

const router = Router();

// CRUD operations
//router.get('/', stockController.getAllStocks);
//router.get('/:symbol', stockController.getStockBySymbol);
//router.post('/', stockController.createStock);
//router.put('/:symbol', stockController.updateStock);
//router.delete('/:symbol', stockController.deleteStock);
router.get('/:symbol', stockController.getStockData);

// Data fetching and analysis
// Fetches data from database 
router.post('/:symbol/fetch', stockController.fetchAndUpdateStockData);

// Refreshing stock data
router.post('/:symbol/refresh', stockController.getAndUpdateStockData);

// Searching for a specific stock
//router.get('/search/:query', stockController.searchStocks);

//router.get('/:symbol/analyze/kalman', stockController.analyzeWithKalmanFilter);
//router.get('/:symbol/analyze/gpt', stockController.analyzeWithGPT);

// Add validation middleware
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

export default router;