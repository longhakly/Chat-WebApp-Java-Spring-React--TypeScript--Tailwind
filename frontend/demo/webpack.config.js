const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // Your existing webpack configuration goes here

  plugins: [
    // Add the NodePolyfillPlugin
    new NodePolyfillPlugin()
  ]
};
