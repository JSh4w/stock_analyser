// src/routes/filterRoutes.js
import express from 'express';
import * as filterController from '../controllers/filterController';

const router = express.Router();

router.post('/:symbol/filter', filterController.applyKalmanFilter);

export default router;