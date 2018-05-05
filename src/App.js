import React, { Component } from 'react';
import './App.css';
import Game from './Game/Game';

class App extends Component {
  render() {
    return (
      <div className="root">
        <div className="app">
          <Game />
        </div>
      </div>
    );
  }
}

export default App;
