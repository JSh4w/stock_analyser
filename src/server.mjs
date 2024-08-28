// server.js (Backend Main File)
/**
 * @fileoverview Main server file for stock_analyser
 * @version 0.0.1
 * @author Jonathan Shaw <jontyshaw@btinternet.com>
 * @license MIT
 *
 * This is the entry point for the stock_analyser backend. It sets up the 
 * Express server, connects to the database, and defines the main API routes.
 *
 * Environment variables:
 * - PORT: The port number for the server to listen on
 * - DB_URI: MongoDB connection string
 *
 * Key dependencies:
 * - Express.js: Web application framework
 * - Mongoose: MongoDB object modeling tool
 * - dotenv: Loads environment variables from a .env file
 *
 * For detailed API documentation, see API.md
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import stockRoutes from './routes/stockRoutes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: __dirname + '/.env' });
const PORT = process.env.PORT || 3000;

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
  res.send('Stock Analysis API');
});

// Routes for Express backend
app.use('/api/stocks', stockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});