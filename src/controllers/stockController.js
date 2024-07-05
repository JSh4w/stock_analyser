//import stock schema from model
const Stock = require('../models/Stock');


//This is for making it into a CRUD app-esque 
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'symbol name lastUpdated');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStock = async (req, res) => {
  const stock = new Stock({
    symbol: req.body.symbol,
    name: req.body.name,
    data: req.body.data,
  });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add update and delete methods as needed