import img from "../../resources/invaders.png";

let spriteImg = new Image();
spriteImg.src = img;

export default class Sprite {
  constructor(frames = [], frameDuration = 40) {
    this.spriteFrames = 0;
    this.currentFrame = 0;
    this.nsprites = 0;
    this.frame = 0;
    this.frames = frames;
    this.frameDuration = frameDuration;

    if (frames.length) {
      this.nsprites = frames.length;
    }
  }

  getNextFrame() {
    if (this.currentFrame + 1 >= this.frames.length) {
      return 0;
    }

    return this.currentFrame + 1;
  }

  render(ctx, x, y, width, height) {
    let currentFrame = this.frames[this.currentFrame];

    if (this.frameDuration && this.spriteFrames >= this.frameDuration) {
      this.currentFrame = this.getNextFrame();
      currentFrame = this.frames[this.currentFrame];
      this.spriteFrames = 0;
    }

    this.spriteFrames++;
    ctx.drawImage(
      spriteImg,
      currentFrame.x,
      currentFrame.y,
      currentFrame.width,
      currentFrame.height,
      x,
      y,
      width,
      height
    );

  }
}
