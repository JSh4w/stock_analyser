import React from 'react';
import { Line } from 'react-chartjs-2';

function StockChart({ data }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Close Price',
        data: data.map(d => d.close),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return <Line data={chartData} />;
}

export default StockChart;