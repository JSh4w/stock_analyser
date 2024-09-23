// Kalman Filter for Stock Price Prediction

class KalmanFilterStocks {
    constructor(initialState, initialCovariance, processNoise, measurementNoise) {
      // State vector: [price, velocity]
      this.state = initialState;
      
      // Covariance matrix
      this.covariance = initialCovariance;
      
      // Process noise covariance
      this.Q = processNoise;
      
      // Measurement noise covariance
      this.R = measurementNoise;
      
      // State transition matrix
      this.F = [[1, 1], [0, 1]];
      
      // Measurement matrix
      this.H = [1, 0];
    }
  
    // Predict the next state
    predict() {
      // Predict state: x = Fx
      this.state = this.matrixMultiply(this.F, this.state);
      
      // Predict covariance: P = FPF' + Q
      this.covariance = this.matrixAdd(
        this.matrixMultiply(
          this.matrixMultiply(this.F, this.covariance),
          this.transpose(this.F)
        ),
        this.Q
      );
    }
  
    // Update the state based on a measurement
    update(measurement) {
      // Innovation: y = z - Hx
      const innovation = measurement - this.matrixMultiply(this.H, this.state)[0];
      
      // Innovation covariance: S = HPH' + R
      const innovationCovariance = this.matrixAdd(
        this.matrixMultiply(
          this.matrixMultiply(this.H, this.covariance),
          this.transpose(this.H)
        )[0][0],
        this.R
      );
      
      // Kalman gain: K = PH' / S
      const kalmanGain = this.matrixMultiply(
        this.matrixMultiply(this.covariance, this.transpose(this.H)),
        1 / innovationCovariance
      );
      
      // Update state: x = x + Ky
      this.state = this.matrixAdd(
        this.state,
        this.matrixMultiply(kalmanGain, innovation)
      );
      
      // Update covariance: P = (I - KH)P
      const identity = [[1, 0], [0, 1]];
      this.covariance = this.matrixMultiply(
        this.matrixSubtract(identity, this.matrixMultiply(kalmanGain, this.H)),
        this.covariance
      );
    }
  
    // Matrix multiplication
    matrixMultiply(a, b) {
      if (typeof b[0] !== 'object') {
        return a.map(row => row.reduce((sum, val, i) => sum + val * b[i], 0));
      }
      return a.map(row => 
        b[0].map((_, i) => 
          row.reduce((sum, val, j) => sum + val * b[j][i], 0)
        )
      );
    }
  
    // Matrix addition
    matrixAdd(a, b) {
      return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }
  
    // Matrix subtraction
    matrixSubtract(a, b) {
      return a.map((row, i) => row.map((val, j) => val - b[i][j]));
    }
  
    // Matrix transpose
    transpose(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }
  
    // Get the current price estimate
    getPriceEstimate() {
      return this.state[0];
    }
  
    // Get the current velocity (trend) estimate
    getVelocityEstimate() {
      return this.state[1];
    }
  }
  
  // Usage example
  function runStockPrediction(stockPrices) {
    // Initialize Kalman filter
    // Initial state: [initial price, initial velocity]
    // Initial covariance: uncertainty in initial estimates
    // Process noise: how much we expect the price and velocity to vary
    // Measurement noise: how noisy we expect our price measurements to be
    const kf = new KalmanFilterStocks(
      [stockPrices[0], 0],
      [[1, 0], [0, 1]],
      [[0.1, 0], [0, 0.01]],
      1
    );
  
    const estimates = [];
    const velocities = [];
  
    for (let price of stockPrices) {
      kf.predict();
      kf.update(price);
      estimates.push(kf.getPriceEstimate());
      velocities.push(kf.getVelocityEstimate());
    }
  
    return { estimates, velocities };
  }
  
  // Example stock prices
  const stockPrices = [100, 101, 102, 101, 103, 105, 104, 106, 105, 107];
  const { estimates, velocities } = runStockPrediction(stockPrices);
  
  console.log("Original prices:", stockPrices);
  console.log("Kalman filter estimates:", estimates);
  console.log("Estimated velocities:", velocities);