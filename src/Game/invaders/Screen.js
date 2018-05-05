import raf from 'raf';

export default class Screen {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = canvas.clientWidth;
    this.height = canvas.height = canvas.clientHeight;
    this.animation = null;
  }

  clock(callback) {
    let animationCallback = () => {
      this.clear();
      callback.call(this);

      raf(animationCallback);
    };

    this.animation = raf(animationCallback);

    return this.animation;
  }

  stop() {
    this.animation.stop();

    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
