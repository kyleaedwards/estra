const Sample = require('./sample');
const { $ } = require('../utils');

/**
 * Constants
 */
const DEFAULT_DELAY = 0.2;
const DEFAULT_FEEDBACK = 0.25;

class Sampler {
  constructor(ctx) {
    this.ctx = ctx;

    // Store sample buffers
    this.samples = [];
    this.sampleMap = {};
    this.loaded = [];

    // Listeners
    this.listeners = {
      sampleLoad: [],
      sampleStart: [],
      sampleStop: [],
    };

    const scope = $('scope');
    const scopeParent = $('areaScope');

    // Analyser
    const analyser = ctx.createAnalyser();
    analyser.connect(ctx.destination);
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    const canvasCtx = scope.getContext('2d');
    let width = scope.width;
    let height = scope.height;

    const resizeWindow = () => {
      scope.height = scopeParent.offsetHeight;
      scope.width = scopeParent.offsetWidth;
      width = scope.width;
      height = scope.height;
      console.log(scope.width);
    }
    window.addEventListener('resize', resizeWindow);
    window.onload = resizeWindow;

    canvasCtx.clearRect(0, 0, width, height);
    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.clearRect(0, 0, width, height);
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
      canvasCtx.beginPath();
      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height/2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
    };

    draw();

    // Reverb/Delay Bus
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(DEFAULT_DELAY, 0);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(DEFAULT_FEEDBACK, 0);
    delay.connect(analyser);
    delay.connect(feedback);
    feedback.connect(delay);

    this.delay = delay;
    this.feedback = feedback;
    this.analyser = analyser;
    this.destination = ctx.destination;
  }

  on(eventLabel, cb) {
    if (this.listeners[eventLabel]) {
      this.listeners[eventLabel].push(cb);
    }
    return () => {
      if (this.listeners[eventLabel]) {
        this.listeners[eventLabel] = this.listeners[eventLabel].filter(fn => fn !== cb);
      }
    }
  }

  triggerListener(eventLabel, ...args) {
    if (this.listeners[eventLabel]) {
      this.listeners[eventLabel].forEach((listener) => {
        listener.apply(null, args);
      });
    }
  }

  getSample(key) {
    let sample = this.sampleMap[key];
    if (!sample) {
      sample = new Sample(this.ctx, { key }, () => {
        this.triggerListener('sampleLoad', sample);
      });
      this.sampleMap[key] = sample;
      this.samples.push(sample);
    }
    return sample;
  }

  getActualGain(gain, delay) {
    const output = gain / Math.sqrt(1 + delay);
    if (isNaN(output)) {
      return 0;
    }
    return output;
  }

  getActualDelay(gain, delay) {
    const output = Math.sqrt(delay) * gain;
    if (isNaN(output)) {
      return 0;
    }
    return output;
  }

  trigger(key) {
    const sample = this.getSample(key);
    if (!sample.buffer) {
      return;
    }
    sample.lastTrigger = this.lastTimestamp;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.getActualGain(sample.gain, sample.delay), 0);
    const delay = this.ctx.createGain();
    delay.gain.setValueAtTime(this.getActualDelay(sample.gain, sample.delay), 0);
    source.buffer = sample.buffer;
    gain.connect(this.analyser);
    delay.connect(this.delay);
    source.connect(gain);
    source.connect(delay);
    source.start(0);
    this.triggerListener('sampleStart', sample);
    setTimeout(() => {
      source.disconnect(gain);
      source.disconnect(delay);
      gain.disconnect(this.analyser);
      delay.disconnect(this.delay);
      this.triggerListener('sampleStop', sample);
    }, sample.duration);
  }

  updateSample(key, opts) {
    const sample = getSample(key);
    if (!sample.buffer) {
      return;
    }
    sample.update(opts);
  }
}

module.exports = Sampler;
