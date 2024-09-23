// dataPreprocessingService.mjs

export function calculateLogReturns(prices) {
    //this function should return an array of log returns
    //by removing the first element (slice.(1) is used to remove the first element)
    //price/ prices[index] is actually now p[t]/p[t-1]
    return prices.slice(1).map((price, index) => Math.log(price / prices[index]));
}

export function logReturnToPrice(lastPrice, logReturn) {
    return lastPrice * Math.exp(logReturn);
}

export function preprocessStockData(closingPrices) {
    const logReturns = calculateLogReturns(closingPrices);
    return {
        originalPrices: closingPrices,
        logReturns: logReturns
    };
}

export function postprocessPrediction(lastPrice, predictedLogReturn) {
    return logReturnToPrice(lastPrice, predictedLogReturn);
}

export default {
    preprocessStockData,
    postprocessPrediction
};