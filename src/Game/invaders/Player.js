
export default class Player {
  constructor(screen) {
    this.screen = screen;
  }

  render() {
    let ctx = this.screen.ctx;

    ctx.rect(20, 20, 150, 100);
    ctx.stroke();
  }
}
