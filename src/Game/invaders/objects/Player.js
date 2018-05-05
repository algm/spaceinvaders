import GameObject from "./GameObject";
import Sprite from "./Sprite";
import InputHandler from "./InputHandler";

export default class Player extends GameObject {
  constructor(screen, settings = {}) {
    super(
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
}
