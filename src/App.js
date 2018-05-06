import React, { Component } from 'react';
import './App.css';
import Game from './Game/Game';

class App extends Component {
  render() {
    return (
      <div className="root">
        <div className="app">
          <div className="ratio"></div>
          <div className="canvas-container">
            <Game />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
