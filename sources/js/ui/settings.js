/**
 * Imports
 */
const { $, clampf } = require('../utils');

class Settings {
  constructor() {
    this.noSample = $('noSample');
    this.sampleInfo = $('sampleInfo');
    this.clip = $('clip');
    this.gain = $('gain');
    this.delay = $('delay');
    this.playing = $('playing');
    this.setupValue('gain');
    this.setupValue('delay');
  }

  setupValue(val) {
    const el = this[val];
    let pageX = 0;
    let value;
    let newValue;
    const onMouseMove = (e) => {
      newValue = clampf(value + (e.pageX - pageX) / 200);
      this.sample.update({ [val]: newValue });
      el.innerText = Math.floor(100 * newValue);
    }
    function onMouseUp(e) {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      value = newValue;
      el.innerText = Math.floor(100 * value);
    }
    el.addEventListener('mousedown', (e) => {
      pageX = e.pageX;
      value = this.sample[val];
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    });
  }

  toggle(sample) {
    if (this.sample === sample) {
      this.hide();
    } else {
      this.show(sample);
    }
  }

  show(sample) {
    this.sample = sample;
    this.noSample.style.display = 'none';
    this.sampleInfo.style.display = 'block';
    this.clip.innerText = sample.filename;
    this.gain.innerText = Math.floor(100 * sample.gain);
    this.delay.innerText = Math.floor(100 * sample.delay);
  }

  hide() {
    this.sample = null;
    this.noSample.style.display = 'block';
    this.sampleInfo.style.display = 'none';
  }
}

module.exports = Settings;
