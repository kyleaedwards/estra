const fs = require('fs');
const { b36tof, ftob36 } = require('./utils');

exports.read = (file, cb) => {
  fs.readFile(file, 'utf-8', (err, lines) => {
    if (err) {
      console.log(err);
      return;
    }
    lines.split('\n').reduce((prev, line) => {
      const [key, file, g, d, v] = line.split(':');
      const gain = b36tof(g);
      const delay = b36tof(d);
      const reverb = b36tof(v);
      return Object.assign({}, prev, { [key]: { key, file, gain, delay, reverb }});
    }, {});
    cb(lines);
  });
};

exports.write = (file, data, cb) => {
  const lines = Object.keys(data).map((key) => {
    const { file, gain, delay, reverb } = data[key];
    const g = ftob36(gain);
    const d = ftob36(delay);
    const v = ftob36(reverb);
    return `${key}:${file}:${g}:${d}:${v}`;
  }).join('\n');
  fs.writeFile(file, lines, (err,) => {
    if (err) {
      console.log(err);
      return;
    }
    cb();
  });
};
