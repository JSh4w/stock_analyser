import React from 'react';
import StockView from './components/StockView';
import StockChart from './components/StockChart';

function App() {
  return (
    <div className="App">
      <h1>Stock Analysis App</h1>
      <StockView />
      <StockChart />
    </div>

  );
}

export default App;