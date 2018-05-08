import GameObject from "./GameObject";
import Sprite from "./Sprite";
import Bullet from "./Bullet";

const sprites = {
  top: [
    {
      x: 22,
      y: 0,
      width: 16,
      height: 16
    },
    {
      x: 22,
      y: 16,
      width: 16,
      height: 16
    }
  ],
  middle: [
    {
      x: 0,
      y: 0,
      width: 22,
      height: 16
    },
    {
      x: 0,
      y: 16,
      width: 22,
      height: 16
    }
  ],
  bottom: [
    {
      x: 38,
      y: 0,
      width: 24,
      height: 16
    },
    {
      x: 38,
      y: 16,
      width: 24,
      height: 16
    }
  ]
};

const sizes = {
  top: {
    width: 16,
    height: 16,
    offsetX: 1.1
  },
  middle: {
    width: 22,
    height: 16,
    offsetX: 0.3
  },
  bottom: {
    width: 24,
    height: 16,
    offsetX: 0
  }
};

const points = {
  top: 300,
  middle: 200,
  bottom: 100
};

const widthPct = 6.285714285714286;
const heightPct = 5.333333333333334;
const spacingX = 0.8;
const spacingY = 1.8;

export default class Invader extends GameObject {
  constructor(offsetY, offsetX, matrix, sprite = "top") {
    super(matrix.game, matrix.screen, {
      sprite: new Sprite(sprites[sprite]),
      width: sizes[sprite].width,
      height: sizes[sprite].height,
      x: sizes[sprite].offsetX + spacingX + offsetX * (widthPct + spacingX),
      y: heightPct + offsetY * (heightPct + spacingY),
      velocity: 0.8
    });

    this.points = points[sprite];
    this.col = offsetX;
    this.row = offsetY;
    this.bullet = null;
    this.matrix = matrix;
  }

  hasInvaderBelow() {
    return this.matrix.findByColAndRow(this.col, this.row + 1) !== undefined;
  }

  fire() {
    let offsetY = (this.getHeight() + 3) * 100 / this.screen.height;
    let offsetX = (this.getWidth() + 3) * 100 / this.screen.width / 2;

    if (!this.hasInvaderBelow() && !this.bullet) {
      if (Math.random() >= 0.998) {
        this.bullet = new Bullet(
          this.game,
          this.screen,
          {
            x: this.settings.x + offsetX,
            y: this.settings.y + offsetY,
            velocity: 1
          },
          "down"
        );
        this.game.addObject(this.bullet);

        this.bullet.onDestroy(() => {
          this.bullet = null;
        });
      }
    }
  }

  checkTargets() {
    let found = this.game.findObject(obj => {
      return this.isCollidingWith(obj);
    });

    if (found) {
      found.destroy();
    }
  }

  onUpdate(callback) {
    this.checkTargets();

    if (typeof callback === "function") {
      callback(this);
    }
  }

  moveDown() {
    let offsetY = this.getHeight() * 100 / this.screen.height;
    this.move(0, offsetY / 2);
  }

  isInLimit() {
    const maxX = this.screen.width - this.getWidth();
    const maxXPct = maxX * 100 / this.screen.width;

    return this.settings.x <= 0 || this.settings.x >= maxXPct;
  }
}
