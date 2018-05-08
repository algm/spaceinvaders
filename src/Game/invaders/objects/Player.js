import GameObject from "./GameObject";
import Sprite from "./Sprite";
import InputHandler from "./InputHandler";
import Bullet from './Bullet';

export default class Player extends GameObject {
  constructor(game, screen, settings = {}) {
    super(
      game,
      screen,
      Object.assign(
        {
          sprite: new Sprite([
            {
              x: 62,
              y: 0,
              width: 22,
              height: 16
            }
          ]),
          width: 22,
          height: 16,
          x: 43,
          y: 93,
          velocity: 0.8
        },
        settings
      )
    );

    this.input = new InputHandler();
    this.bullet = null;
  }

  onUpdate() {
    // update tank position depending on pressed keys
    if (this.input.isDown(37)) {
      // Left
      this.settings.x -= this.settings.velocity;
    }

    if (this.input.isDown(39)) {
      // Right
      this.settings.x += this.settings.velocity;
    }

    if (this.input.isPressed(32)) {
      // Space
      this.fire();
    }
  }

  fire() {
    if (!this.bullet) {
      this.bullet = new Bullet(this.game, this.screen, { x: this.settings.x + 2.78, y: this.settings.y - 1.8, velocity: 1 }, "up");
      this.game.addObject(this.bullet);
      this.game.play('playershoot');

      this.bullet.onDestroy(() => {
        this.bullet = null;
      });
    }
  }
}
