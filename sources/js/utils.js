/**
 * Prevent number from exceeding provided min and max values.
 * @param {Number} lo Lower bound
 * @param {Number} hi Upper bound
 */
const clamp = (lo, hi) => n => Math.min(hi, Math.max(lo, n));
exports.clamp = clamp;

/**
 * Clamp between zero and one.
 * @param {Number} n Number to clamp
 */
const clampf = clamp(0, 1);
exports.clampf = clampf;

/**
 * Float <-> base36 converters
 */
exports.ftob36 = f => Math.floor(clampf(f) * 35).toString(36);
exports.b36tof = b36 => clampf(parseInt(b36, 36) / 35);

/**
 * UI utilities
 */
const $ = id => document.getElementById(id);
const el = tag => document.createElement(tag);
const span = (str, max) => {
  const span = el('span');
  span.innerHTML = `<span>${str}</span>${'.'.repeat(max - str.length)}`;
  return {
    span,
    set(newStr) {
      span.innerHTML = `<span>${newStr}</span>${'.'.repeat(max - newStr.length)}`;
    },
  };
};
exports.$ = $;
exports.el = el;
exports.span = span;
