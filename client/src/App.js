import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockList from './components/StockList';
import StockDetails from './components/StockDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Stock Analysis App</h1>
        <Routes>
          <Route path="/" element={<StockList />} />
          <Route path="/stock/:symbol" element={<StockDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;