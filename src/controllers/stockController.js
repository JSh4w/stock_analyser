//import stock schema from model
//stock is a data type
const Stock = require('../models/Stock');
const { fetchStockData } = require('../stockDataFetcher');


// In general:
/**
 * Get a single stock by symbol
 * @param {Object} req - The request object
 * @param {Object} res - The response object
*/
exports.getAllStocks = async (req, res) => {
  try {
    // Retrieve all stocks from the database, excluding the 'data' field
    // and only returning the 'symbol', 'name' and 'lastUpdated' fields.
    const stocks = await Stock.find({}, 'symbol name lastUpdated');

    // Send the retrieved stocks as a JSON response.
    res.json(stocks);
  } catch (error) {
    // If there was an error, send a 500 status code with the error message.
    res.status(500).json({ message: error.message });
  }
};


exports.getStockBySymbol = async (req, res) => {
  try {
    // Find a stock in the database by its symbol
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    // If the stock is found, send it as a JSON response
    if (stock) {
      res.json(stock);
    // If the stock is not found, send a 404 error response
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  // If there was an error, send a 500 error response with the error message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStock = async (req, res) => {
  // Create a new stock object with the provided symbol and name
  const stock = new Stock({
    symbol: req.body.symbol, // Set the symbol from the request body
    name: req.body.name, // Set the name from the request body
  });

  try {
    // Save the stock object to the database and return the newly created stock object
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (error) {
    // If there was an error, return a 400 status code with the error message
    res.status(400).json({ message: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    // Find the stock to update by its symbol and update the fields specified in the request body
    const updatedStock = await Stock.findOneAndUpdate(
      { symbol: req.params.symbol },
      { $set: req.body },
      { new: true }
    );

    // If the stock was found and updated, send the updated stock as a JSON response
    if (updatedStock) {
      res.json(updatedStock);
    // If the stock was not found, send a 404 error response
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  // If there was an error updating the stock, send a 400 error response with the error message
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a stock   v  
exports.deleteStock = async (req, res) => {
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

// Fetch and update stock data
exports.fetchAndUpdateStockData = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const stockData = await fetchStockData(symbol);
    
    // Process stockData and update the database
    const updatedStock = await Stock.findOneAndUpdate(
      { symbol: symbol },
      { 
        $set: { 
          data: stockData,
          lastUpdated: new Date()
        }
      },
      { new: true, upsert: true }
    );

    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add placeholder for Kalman filter analysis
exports.analyzeWithKalmanFilter = async (req, res) => {
  // Implement Kalman filter analysis here
  res.status(501).json({ message: 'Kalman filter analysis not implemented yet' });
};

// Add placeholder for GPT analysis
exports.analyzeWithGPT = async (req, res) => {
  // Implement GPT analysis here
  res.status(501).json({ message: 'GPT analysis not implemented yet' });
};

// Can add more 