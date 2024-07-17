import React, { useState } from 'react';

function StockSearch({ onSearch }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(symbol);
    setSymbol('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol"
      />
      <button type="submit">Add Stock</button>
    </form>
  );
}

export default StockSearch;