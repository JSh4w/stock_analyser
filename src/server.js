//Importing Express.js module for backend and assigning as express
const express = require('express');
//Importing Mongoose module and assign to mongoose, it is an Object Data Modeling library (ODM) for MongoDB
const mongoose = require('mongoose');
//Importing cors module to enable Cross-Origin Resource sharing -> allows web servers to specify which origins 
//can access their resources
const cors = require('cors');

//Load environment variables from .env file using dotenv module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes (will be added later)
app.get('/', (req, res) => {
  res.send('Stock Analysis API');
});


//Routes for Express backend 
const stockRoutes = require('./routes/stockRoutes');
//any api request that starts with /api/stocks will go to stockRoutes.
//E.g a client sends a get request to /api/stocks/some-stock-smbol, the route handler in stockRoutes module will be executeds
app.use('/api/stocks', stockRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});


//For kalmann filter
//const filterRoutes = require('./src/routes/filterRoutes');
//app.use('/api/filter', filterRoutes);

// ... rest of your server setup



// --- This should be the final command --- // 

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  

