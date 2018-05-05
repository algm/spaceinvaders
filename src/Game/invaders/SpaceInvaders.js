import Screen from './Screen';
import Player from './objects/Player';

export default class SpaceInvaders {
  constructor(canvas) {
    this.canvas = canvas;
    this.score = 0;
    this.screen = new Screen(canvas);
    this.objects = [];

    this.initialize();
  }

  initialize() {
    this.objects.push(new Player(this.screen));

    this.screen.clock(this.render.bind(this));
  }

  render(screen) {
    for (let obj of this.objects) {
      obj.render();
    }
  }
}
