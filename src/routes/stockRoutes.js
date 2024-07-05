const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStocks);
router.get('/:symbol', stockController.getStockBySymbol);
router.post('/', stockController.createStock);

// Add routes for update and delete as needed

module.exports = router;