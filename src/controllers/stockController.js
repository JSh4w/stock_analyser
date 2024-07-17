//import stock schema from model
//stock is a data type
const Stock = require('../models/Stock');
//const { fetchStockData } = require('../stockDataFetcher');
const alphaVantageApi = require('../services/alphaVantageAPI');


// In general:
/**
 * Get a single stock by symbol
 * @param {Object} req - The request object
 * @param {Object} res - The response object
*/
/**exports.getAllStocks = async (req, res) => {
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
};**/


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
    const { symbol } = req.params;
    const data = await alphaVantageApi.fetchStockData(symbol);
    
    // Process stockData and update the database
    const timeSeriesData = data['Time Series (Daily)'];
    const processedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date: new Date(date),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseFloat(values['5. volume']),
    }));

    // Update the stock data in the database
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

    // Fetch the updated stock data from the database
    res.json({ message: 'Stock data updated successfully' });

  } catch (error) {
    console.error('Error updating stock data'.error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol });
    if (stock) {
      res.json({
        symbol: stock.symbol,
        name: stock.name,
        data: stock.data // This should be an array of objects
      });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
};

exports.searchStocks = async (req, res) => {
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