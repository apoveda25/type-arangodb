const swc = require('unplugin-swc');

module.exports = {
  rollup(config, options) {
    config.plugins.push(swc.rollup());
    return config;
  },
};
