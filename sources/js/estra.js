/**
 * Imports
 */
const Sampler = require('./audio/sampler');
const Menu = require('./ui/menu');

/**
 * Constants
 */
const audioCtx = new AudioContext();

let menu;
let sampler;

module.exports = {
  init() {
    menu = new Menu();
    sampler = new Sampler(audioCtx);

    sampler.on('sampleLoad', (sample) => {
      menu.addOption(sample);
    });

    sampler.on('sampleStart', ({ key }) => {
      menu.flash(key);
    });

    sampler.on('sampleStop', ({ key }) => {
      menu.unflash(key);
    });
  },

  trigger(key) {
    sampler.trigger(key);
  },

  close() {},
};
