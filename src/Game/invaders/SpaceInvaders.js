import Screen from './Screen';
import Player from './objects/Player';
import Invaders from './Invaders';
import sound from './sound';

export default class SpaceInvaders {
  constructor(canvas) {
    this.canvas = canvas;
    this.score = 0;
    this.screen = new Screen(canvas);
    this.objects = {};

    this.initialize();
  }

  async initialize() {
    await sound.initialize();

    this.player = new Player(this, this.screen);
    this.addObject(this.player);

    this.invaders = new Invaders(this, this.screen, this.player);

    this.screen.clock(() => {
      this.invaders.update();
      this.render();
    });
  }

  addObject(obj) {
    this.objects[obj.oid] = obj;
  }

  findObject(filterFunction) {
    return Object.values(this.objects).find(filterFunction);
  }

  removeObject(obj) {
    const id = obj.oid;

    delete this.objects[id];
  }

  play(key) {
    sound.play(key);
  }

  render() {
    for (let obj of Object.values(this.objects)) {
      obj.render();
    }
  }
}
