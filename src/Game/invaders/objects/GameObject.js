import uniqueid from "uniqueid";

function getWidthWithProportions(objectWidth, screenWidth) {
  const originalWidth = 350;

  return objectWidth / originalWidth * screenWidth;
}

function getHeightWithProportions(objectHeight, screenHeight) {
  const originalHeight = 300;

  return objectHeight / originalHeight * screenHeight;
}

function computePositionFromPct(positionPct, size) {
  return positionPct * size / 100;
}

const uq = uniqueid("obj-");

export default class GameObject {
  constructor(game, screen, settings = {}) {
    this.game = game;
    this.screen = screen;
    this.settings = Object.assign(
      {
        x: 50,
        y: 50,
        width: 10,
        height: 10,
        velocity: getWidthWithProportions(4, this.screen.width)
      },
      settings
    );

    this.oid = uq();
  }

  getPosX() {
    return computePositionFromPct(this.settings.x, this.screen.width);
  }

  getPosY() {
    return computePositionFromPct(this.settings.y, this.screen.height);
  }

  getWidth() {
    return getWidthWithProportions(this.settings.width, this.screen.width);
  }

  getHeight() {
    return getHeightWithProportions(this.settings.height, this.screen.height);
  }

  isCollidingWith(obj) {
    return !(
      this === obj ||
      this.getPosX() + this.getWidth() <= obj.getPosX() ||
      this.getPosY() + this.getHeight() <= obj.getPosY() ||
      this.getPosX() >= obj.getPosX() + obj.getWidth() ||
      this.getPosY() >= obj.getPosY() + obj.getHeight()
    );
  }

  destroy() {
    let callback = this.onDestroyCallback;

    if (typeof callback === "function") {
      callback(this);
    }

    this.game.removeObject(this);

    return this;
  }

  move(offsetX = 0, offsetY = 0) {
    this.settings.x += offsetX;
    this.settings.y += offsetY;
  }

  onDestroy(callback) {
    this.onDestroyCallback = callback;
  }

  render() {
    let ctx = this.screen.ctx;

    if (typeof this.onUpdate === "function") {
      this.onUpdate();
    }

    if (this.settings.x < 0) {
      this.settings.x = 0;
    }

    const maxX =
      this.screen.width -
      this.getWidth();
    const maxXPct = maxX * 100 / this.screen.width;

    if (this.settings.x > maxXPct) {
      this.settings.x = maxXPct;
    }

    if (this.settings.sprite) {
      this.settings.sprite.render(
        ctx,
        this.getPosX(),
        this.getPosY(),
        this.getWidth(),
        this.getHeight()
      );
    } else {
      // set the current fillstyle and draw sprite
      ctx.fillStyle = this.settings.color;
      ctx.fillRect(
        this.getPosX(),
        this.getPosY(),
        this.getWidth(),
        this.getHeight()
      );
    }
  }
}
