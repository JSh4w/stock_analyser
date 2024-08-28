// App.js (Frontend Main File)
/**
 * @fileoverview Main component for stock_analyser frontend
 * @version 0.0.1
 * @author Jonathan Shaw <jontyshaw@btinternet.com>
 * @license MIT
 *
 * This is the root component of the stock_analyser React application.
 * It sets up the main layout, routing, and global state management.
 *
 * Key dependencies:
 * - React: JavaScript library for building user interfaces
 * - React Router: Declarative routing for React applications
 * 
 *
 * For component documentation, see COMPONENTS.md
 */

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