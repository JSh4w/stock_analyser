const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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





// --- This should be the final command --- // 

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  

