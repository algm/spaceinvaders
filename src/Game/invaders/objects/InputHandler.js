export default class InputHandler {
  constructor() {
    this.down = {};
    this.pressed = {};

    document.addEventListener("keydown", evt => {
      this.down[evt.keyCode] = true;
    });

    document.addEventListener("keyup", evt => {
      delete this.down[evt.keyCode];
      delete this.pressed[evt.keyCode];
    });
  }

  /**
   * Returns whether a key is pressod down
   * @param  {number}  code the keycode to check
   * @return {bool}         the result from check
   */
  isDown(code) {
    return this.down[code];
  }

  /**
   * Return wheter a key has been pressed
   * @param  {number}  code the keycode to check
   * @return {bool}         the result from check
   */
  isPressed(code) {
    // if key is registred as pressed return false else if
    // key down for first time return true else return false
    if (this.pressed[code]) {
      return false;
    } else if (this.down[code]) {
      return (this.pressed[code] = true);
    }
    return false;
  }
}
