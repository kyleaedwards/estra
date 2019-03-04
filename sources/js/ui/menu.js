/**
 * Imports
 */
const { $ } = require('../utils');
const Option = require('./option');
const Settings = require('./settings');

/**
 * Constants
 */
const STARTING_ROWS = 12;

class Menu {
  constructor() {
    this.el = $('samples');
    this.settings = new Settings();
    this.options = [];
    this.samples = {};
    this.numSamples = 0;
    for (let i = 0; i < STARTING_ROWS; i++) {
      const option = new Option(i, STARTING_ROWS);
      this.options.push(option);
      this.el.appendChild(option.li);
    }
  }

  addOption(sample) {
    const { key } = sample;
    let option = this.options[this.numSamples];
    if (!option) {
      option = new Option(this.numSamples, STARTING_ROWS);
      this.options.push(option);
      this.el.appendChild(option.li);
    }
    option.li.addEventListener('click', (e) => {
      this.options.forEach((opt) => {
        if (opt !== option) {
          opt.li.className = '';
        }
      });
      option.li.classList.toggle('toggled');
      this.settings.toggle(sample);
    });
    option.set(sample);
    this.samples[key] = option;
    this.numSamples++;
  }

  flash(key) {
    if (this.samples[key]) {
      this.samples[key].flash();
    }
  }

  unflash(key) {
    if (this.samples[key]) {
      this.samples[key].unflash();
    }
  }
}

module.exports = Menu;
