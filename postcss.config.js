const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");
const cssnano = require("cssnano");
const IN_PRODUCTION = process.env.NODE_ENV === "production";

const plugins = [];
if (IN_PRODUCTION) {
  plugins.push(postcssImport);
}

module.exports = {
  plugins: [...plugins, autoprefixer, cssnano],
};
