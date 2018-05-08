import Invader from "./objects/Invader";

export default class Invaders {
  constructor(game, screen, player) {
    this.game = game;
    this.screen = screen;
    this.player = player;
    this.count = 0;
    this.collection = [];
    this.shouldTurn = false;
    this.currentDirection = "right";
    this.speed = 0.05;
    this.index = {};

    this.initialize();
  }

  initialize() {
    this.addInvadersToGame();
  }

  addInvadersToGame() {
    let i, j;

    //top invaders
    for (i = 0; i < 6; i++) {
      for (j = 0; j < 11; j++) {
        let sprite = null;

        if (i < 2) {
          sprite = "top";
        }

        if (i >= 2 && i < 4) {
          sprite = "middle";
        }

        if (i >= 4) {
          sprite = "bottom";
        }

        let invader = new Invader(i, j, this, sprite);
        invader.onDestroy(this.onDestroy.bind(this));

        this.game.addObject(invader);

        this.collection.push(invader);
        this.count++;
      }
    }

    this.buildIndex();
  }

  buildIndex() {
    this.index = [];
    for (let invader of this.collection) {
      this.index[invader.col + '_' + invader.row] = invader;
    }
  }

  onDestroy(invader) {
    this.collection = this.collection.filter((item) => {
      return item !== invader;
    });

    this.game.play('invaderkilled');
    this.count--;
    this.buildIndex();
  }

  checkCollisions() {
    for (let invader of this.collection) {
      if (invader.isInLimit()) {
        this.shouldTurn = true;
        break;
      }
    }
  }

  findByColAndRow(col, row) {
    return this.index[col + '_' + row];
  }

  move() {
    if (this.shouldTurn) {
      this.turn();
    }

    let offsetX = this.speed;
    if (this.currentDirection === "left") {
      offsetX *= -1;
    }

    for (let invader of this.collection) {
      invader.move(offsetX, 0);
    }
  }

  turn() {
    if (this.currentDirection === "left") {
      this.currentDirection = "right";
    } else  {
      this.currentDirection = "left";
    }

    this.moveDown();
    this.shouldTurn = false;
  }

  moveDown() {
    for (let invader of this.collection) {
      invader.moveDown();
    }
  }

  fire() {
    for (let invader of this.collection) {
      invader.fire();
    }
  }

  update() {
    this.checkCollisions();

    this.move();
    this.fire();
  }
}
