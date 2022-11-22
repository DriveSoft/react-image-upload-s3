const postcss = require('rollup-plugin-postcss');
const image = require('@rollup/plugin-image');
//const svg = require('rollup-plugin-svg');
//const reactSvg = require('rollup-plugin-svg');
//import reactSvg from "rollup-plugin-react-svg";

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [],
      })
    );

    config.plugins.unshift(image());

    return config;
  },
};