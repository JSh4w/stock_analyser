// Stock.js

import mongoose from 'mongoose';

// Defining a schema for a stock collection in database
// A schema defines the structure of the documents in the collection
const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  // data is an array of objects containing historical data, must be filled
  data: [{
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// This model allows us to interact with the database via the Stock collection
const Stock = mongoose.model('Stock', stockSchema);

export default Stock;