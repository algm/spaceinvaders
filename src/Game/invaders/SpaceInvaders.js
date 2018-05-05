import Screen from './Screen';
import Player from './objects/Player';

export default class SpaceInvaders {
  constructor(canvas) {
    this.canvas = canvas;
    this.score = 0;
    this.screen = new Screen(canvas);
    this.objects = {};

    this.initialize();
  }

  initialize() {
    this.addObject(new Player(this, this.screen));

    this.screen.clock(this.render.bind(this));
  }

  addObject(obj) {
    this.objects[obj.oid] = obj;
  }

  removeObject(obj) {
    const id = obj.oid;

    delete this.objects[id];
  }

  render() {
    for (let obj of Object.values(this.objects)) {
      obj.render();
    }
  }
}
