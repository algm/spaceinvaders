import React, { Component } from 'react';
import './App.scss';
import Game from './Game/Game';

class App extends Component {
  render() {
    return (
      <div className="root">
        <div className="app">
          <div className="canvas-container">
            <div className="container-inner">
              <div className="flexbox-centering">
                <Game />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
