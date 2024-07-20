// src/routes/filterRoutes.js
const express = require('express');
const filterController = require('../controllers/filterController');

const router = express.Router();

router.post('/:symbol/filter', filterController.applyKalmanFilter);

module.exports = router;