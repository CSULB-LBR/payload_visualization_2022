import React from 'react';
import './App.css';
import HUD from './components/HUD';
import PayloadScene from './components/PayloadScene';

function App() {
  return (
    <div className="App">
      <HUD />
      <PayloadScene />
    </div>
  );
}

export default App;
