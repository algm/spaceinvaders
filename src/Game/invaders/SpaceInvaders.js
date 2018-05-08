import Screen from './Screen';
import Player from './objects/Player';
import Invaders from './Invaders';
import sound from './sound';
import GameOver from './objects/GameOver';

export default class SpaceInvaders {
  constructor(canvas) {
    this.canvas = canvas;
    this.screen = new Screen(canvas);
    this.objects = {};
    this.sound = null;

    this.initialize();
  }

  async initialize() {
    if (!this.sound) {
      this.sound = await sound.initialize();
    }

    this.lives = 2;
    this.score = 0;

    this.addPlayer();
    this.invaders = new Invaders(this, this.screen, this.player);

    this.screen.clock(() => {
      if (this.invaders) {
        this.invaders.update();
      }

      this.render();
    });
  }

  addPlayer() {
    this.player = new Player(this, this.screen);
    this.addObject(this.player);

    this.player.onDestroy(this.playerDead.bind(this));
  }

  playerDead() {
    this.player = null;
    this.invaders.stop();
    this.play("explosion");
    this.lives--;

    if (this.lives < 0) {
      this.gameOver();
    } else {
      setTimeout(() => {
        this.addPlayer();
        this.invaders.start();
      }, 1500);
    }
  }

  gameOver() {
    setTimeout(() => {
      this.clearAllObjects();
      this.invaders = null;
      const gameOver = new GameOver(this, this.screen);
      this.addObject(gameOver);

      gameOver.onDestroy(() => {
        this.restart();
      });
    }, 1500);
  }

  restart() {
    this.clearAllObjects();
    this.initialize();
  }

  clearAllObjects() {
    for (let obj of Object.values(this.objects)) {
      this.removeObject(obj);
    }
  }

  addObject(obj) {
    this.objects[obj.oid] = obj;
  }

  findObject(filterFunction) {
    return Object.values(this.objects).find(filterFunction);
  }

  removeObject(obj) {
    const id = obj.oid;

    if (this.objects[id]) {
      delete this.objects[id];
    }
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
