const KalmanFilter = require('kalman-filter');

class KalmanFilterService {
  constructor() {
    this.kf = new KalmanFilter({
      observation: { name: 'close', dimension: 1 },
      dynamic: { name: 'state', dimension: 2 }, // [close, trend]
      control: { name: 'control', dimension: 0 }
    });
  }

  processStockData(data) {
    let filtered = [];
    let state = this.kf.initState([data[0].close, 0]); // Initial state: [initial close, no trend]

    for (let item of data) {
      // Predict
      const predicted = this.kf.predict(state);

      // Update
      state = this.kf.update(predicted, { observation: [item.close] });

      filtered.push({
        date: item.date,
        original: item.close,
        filtered: state.mean[0]
      });
    }

    return filtered;
  }
}

module.exports = new KalmanFilterService();