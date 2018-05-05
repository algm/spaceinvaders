import React, {Component} from 'react';
import SpaceInvaders from './invaders/SpaceInvaders';

export default class Game extends Component {
  initCanvas(canvas) {
    if (!this.game) {
      this.game = new SpaceInvaders(canvas);
    }
  }

  render() {
    return <canvas ref={this.initCanvas.bind(this)}></canvas>;
  }
}
