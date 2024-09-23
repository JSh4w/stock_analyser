import ARIMAPromise from 'arima/async.js';
import { preprocessStockData, postprocessPrediction } from './dataProcessing.mjs';

/**
 * Predicts the next day's stock price using ARIMA
 * @param {number[]} historicalPrices - Array of historical stock prices
 * @param {Object} modelParams - ARIMA model parameters (optional)
 * @returns {Promise<{prediction: number[], error: number}>} - Predicted prices and error
 */
async function predictNextDayStock(historicalPrices, modelParams = {}, predictSteps = 1) {
  if (!Array.isArray(historicalPrices) || historicalPrices.length < 2) {
    throw new Error('Historical prices must be an array with at least 2 data points');
  }

  const defaultParams = {
    auto: true,
    p: 5,
    d: 1,
    q: 0,
    P: 1,
    D: 1,
    Q: 0,
    verbose: false  // Set to true for detailed output
  };
  const params = { ...defaultParams, ...modelParams };

  try {
    const ARIMA = await ARIMAPromise;
    const arima = new ARIMA(params);

    await arima.train(historicalPrices);

    const [predictions, errors] = await arima.predict(predictSteps);

    return {
      prediction: predictions,
      error: errors[0]
    };
  } catch (error) {
    console.error('ARIMA model error:', error);
    throw error;
  }
}

// Example usage
async function main() {
  // Example historical stock prices (replace with your actual data)
  const historicalPrices = [
    100, 101, 103, 102, 105, 107, 106, 109, 108, 110,
    111, 112, 114, 113, 116, 115, 118, 117, 120, 119,140,140,120,110,112,114,116,112,80,70,12,120
  ];

  const logReturns = preprocessStockData(historicalPrices);
  const lastPrice = historicalPrices[historicalPrices.length - 1];
  try {
    const result = await predictNextDayStock(logReturns.logReturns);
    const prediction = postprocessPrediction(lastPrice, result.prediction[0]);
    console.log(`Predicted stock prices for the next day: $${prediction}`);
    console.log(`Prediction error: ${result.error}`);
    console.log(await predictNextDayStock(historicalPrices));
  } catch (error) {
    console.error('Failed to predict stock price:', error);
  }
}

main();