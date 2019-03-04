/**
 * Imports
 */
const { el, span } = require('../utils');

/**
 * Constants
 */
const SATURATION = 15;
const LIGHTNESS = 15;

const hue = (n, max) => Math.floor(360 * n / max);
const sat = (n, max) => Math.floor(n / max) * SATURATION + 50;
const lum = (n, max) => 70 - Math.floor(n / max) * LIGHTNESS;
const toColor = (n, max) => `hsla(${hue(n, max)}, ${sat(n, max)}%, ${lum(n, max)}%, 1)`;

class Option {
  constructor(index, setLength) {
    const color = toColor(index, setLength);

    const li = el('li');
    li.style.opacity = 0.5;
    const key = span('', 9);
    const icon = el('span');
    icon.className = 'icon';
    li.appendChild(icon);
    li.appendChild(key.span);
    
    this.li = li;
    this.icon = icon;
    this.color = color;
    this.key = key;
  }

  flash() {
    this.li.style.opacity = 1;
  }

  unflash() {
    this.li.style.opacity = 0.75;
  }

  set({ key }) {
    this.icon.style.backgroundColor = this.color;
    this.icon.style.borderColor = this.color;
    this.key.set(key || '');
  }
}

module.exports = Option;
