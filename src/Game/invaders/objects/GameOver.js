import GameObject from "./GameObject";
import InputHandler from "./InputHandler";

export default class GameOver extends GameObject {
  constructor(game, screen, settings = {}) {
    super(
      game,
      screen,
      settings
    );

    this.width = this.screen.width;
    this.height = this.screen.height;
    this.input = new InputHandler();
  }

  onUpdate() {
    if (this.input.isPressed(32)) {
      this.destroy();
    }
  }

  render() {
    this.onUpdate();
    let ctx = this.screen.ctx;

    const fontSize = Math.round(this.height / 5);
    ctx.font = fontSize + "px sans-serif";
    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    let textString = "Game Over";
    let scoreString = `Score ${this.game.score}`;

    ctx.fillText(textString, this.width / 2, this.height / 2.5);

    ctx.font = Math.round(fontSize / 2) + "px sans-serif";
    ctx.fillStyle = "rgba(255,255,255, 1)";

    ctx.fillText(scoreString, this.width / 2, this.height / 2.5 + fontSize);

    ctx.font = Math.round(fontSize / 3) + "px sans-serif";
    ctx.fillText('Press space to restart...', this.width / 2, this.height / 2.5 + fontSize + fontSize / 2);
  }
}
