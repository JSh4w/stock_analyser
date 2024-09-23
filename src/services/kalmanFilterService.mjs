import kalmanFilterModule from 'kalman-filter';
const { KalmanFilter } = kalmanFilterModule;

/**
 * Calculates the Simple Moving Average (SMA) of a given dataset.
 * @param {array<number>} data The dataset to calculate the SMA for.
 * @param {number} window The window size for the SMA.
 * @returns {array<number>} The array of SMA calculations.
 */
function calculateSMA(data, window) {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < window - 1) {
            sma.push(null);  // Not enough data for SMA yet
        } else {
            const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / window);
        }
    }
    return sma;
}

/**
 * Predicts the next day's value in a stock's closing price history,
 * using a Simple Moving Average (SMA) of the given window size.
 * @param {array<number>} data The array of closing prices.
 * @param {number} window The window size for the SMA.
 * @returns {?number} The predicted value for the next day, or null if
 * there is not enough data.
 */
function predictNextDaySMA(data, window) {
    if (data.length < window) {
        return null;  // Not enough data
    }
    const sum = data.slice(-window).reduce((a, b) => a + b, 0);
    return sum / window;
}

/**
 * Process a stock's closing prices and returns an object with the following
 * properties:
 * - originalData: The original closing prices.
 * - smaValues: The Simple Moving Average (SMA) of the closing prices.
 * - smaPrediction: The predicted value for the next day using the SMA.
 * - kalmanPredicted: The predictions for each day using the Kalman Filter.
 * - kalmanCorrected: The corrected values for each day using the Kalman Filter.
 * - kalmanNextDay: The predicted value for the next day using the Kalman Filter.
 * @param {array<number>} closingValues The array of closing prices.
 * @param {number} [smaWindow=5] The window size for the SMA.
 * @returns {Object} An object with the above properties.
 */
export function processStockData(closingValues, smaWindow = 5) {
    const smaValues = calculateSMA(closingValues, smaWindow);
    const nextDayPrediction = predictNextDaySMA(closingValues, smaWindow);

    // Kalman Filter setup
    const kf = new KalmanFilter({    
        observation: 1,
        dynamic: 1,
        control: 0
    });

    console.log(closingValues);

    let kalmanPredicted = [];
    let kalmanCorrected = [];

    // Kalman Filter not used correctly 
    closingValues.forEach((value) => {
        const predicted = kf.predict();
        const corrected = kf.correct({ observation: [value.close] });
        
        kalmanPredicted.push(predicted.mean[0]);
        kalmanCorrected.push(corrected.mean[0]);
    });

    // Predict next day using Kalman Filter
    const kalmanNextDay = kf.predict().mean[0];

    return {
        originalData: closingValues,
        smaValues: smaValues,
        smaPrediction: nextDayPrediction,
        kalmanPredicted: kalmanPredicted,
        kalmanCorrected: kalmanCorrected,
        kalmanNextDay: kalmanNextDay
    };
}
export default processStockData