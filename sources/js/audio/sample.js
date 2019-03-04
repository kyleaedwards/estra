/**
 * Imports
 */
const fs = require('fs');
const path = require('path');

class Sample {
  constructor(ctx, { key, gain, delay }, onLoad) {
    this.key = key;
    this.filename = `${key}.wav`;

    // Audio
    this.gain = gain || 0.75;
    this.delay = delay || 0;

    // Base duration in ms
    this.buffer = false;
    this.duration = 2000;
    this.lastTrigger = 0;

    // Loading
    fs.readFile(path.join(__dirname, `../../../samples/${this.filename}`), (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const ab = new ArrayBuffer(data.length);
      const view = new Uint8Array(ab);
      for (let i = 0; i < data.length; ++i) {
        view[i] = data[i];
      }
      ctx.decodeAudioData(ab, (buffer) => {
        this.buffer = buffer;
        this.duration = Math.floor(buffer.duration * 1000 + 20);
        if (onLoad) {
          onLoad();
        }
      }, null);
    });
  }

  update(opts = {}) {
    const { gain, delay } = opts;
    if (gain !== undefined) {
      this.gain = gain;
    }
    if (delay !== undefined) {
      this.delay = delay;
    }
  }
}

module.exports = Sample;
