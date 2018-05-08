import raf from 'raf';

export default class Screen {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = canvas.clientWidth;
    this.height = canvas.height = canvas.clientHeight;
    this.animation = null;
    this.stopped = false;
  }

  clock(callback) {
    if (!this.animation) {
      let animationCallback = () => {
        if (!this.stopped) {
          this.clear();
          callback.call(this);

          return raf(animationCallback);
        }
      };

      this.animation = raf(animationCallback);
    }

    this.stopped = false;

    return this.animation;
  }

  stop() {
    raf.cancel(this.animation);
    this.animation = null;
    this.stopped = true;

    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
