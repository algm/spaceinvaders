function getWidthWithProportions(objectWidth, screenWidth) {
  const originalWidth = 350;

  return objectWidth / originalWidth * screenWidth;
}

function getHeightWithProportions(objectHeight, screenHeight) {
  const originalHeight = 300;

  return objectHeight / originalHeight * screenHeight;
}

function computePositionFromPct(positionPct, size) {
  return Math.floor(positionPct * size / 100);
}

export default class GameObject {
  constructor(screen, settings = {}) {
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
  }

  render() {
    let ctx = this.screen.ctx;

    if (typeof this.onUpdate === 'function') {
      this.onUpdate();
    }

    if (this.settings.x < 0) {
      this.settings.x = 0;
    }

    const maxX = this.screen.width - getWidthWithProportions(this.settings.width, this.screen.width);
    const maxXPct = maxX * 100 / this.screen.width;

    if (this.settings.x > maxXPct) {
      this.settings.x = maxXPct;
    }

    if (this.settings.sprite) {
      this.settings.sprite.render(
        ctx,
        computePositionFromPct(this.settings.x, this.screen.width),
        computePositionFromPct(this.settings.y, this.screen.height),
        getWidthWithProportions(this.settings.width, this.screen.width),
        getHeightWithProportions(this.settings.height, this.screen.height)
      );
    } else {
      // set the current fillstyle and draw sprite
      ctx.fillStyle = this.settings.color;
      ctx.fillRect(
        computePositionFromPct(this.settings.x, this.screen.width),
        computePositionFromPct(this.settings.y, this.screen.height),
        getWidthWithProportions(this.settings.width, this.screen.width),
        getHeightWithProportions(this.settings.height, this.screen.height)
      );
    }
  }
}
