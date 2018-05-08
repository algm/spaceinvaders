import load from "audio-loader";
import playSound from "audio-play";

const soundPrefix = "/sound/";

const sounds = {
  explosion: soundPrefix + "explosion.mp3",
  invaderkilled: soundPrefix + "invaderkilled.mp3",
  playershoot: soundPrefix + "playershoot.mp3",
  ufo: soundPrefix + "ufo.mp3"
};

let playableSounds = {};

export default {
  async initialize() {
    playableSounds = await load(sounds);
  },

  play(key) {
    playSound(playableSounds[key]);
  }
}
