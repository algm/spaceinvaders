import GameObject from "./GameObject";

export default class Bullet extends GameObject {

  constructor(game, screen, settings = {}, direction) {
    super(game, screen, Object.assign({
      width: 2,
      height: 5,
      color: 'rgba(255,255,255, 1)'
    }, settings));

    this.direction = direction;
  }

  checkTargets() {
    let found = this.game.findObject((obj) => {
      return this.isCollidingWith(obj);
    });

    if (found) {
      found.destroy();
      this.destroy();
    }
  }

  onUpdate() {
    this.checkTargets();

    if (this.direction === "down") {
      this.settings.y += this.settings.velocity;
    }

    if (this.direction === "up") {
      this.settings.y -= this.settings.velocity;
    }

    if (this.settings.y < 0 || this.settings.y > 100) {
      this.destroy();
    }
  }
}
