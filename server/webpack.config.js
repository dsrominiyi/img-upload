require('@babel/polyfill');
var webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/app.js'],
  output: {
    path: __dirname,
    filename: 'server.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['@babel/env']
        }
      }
    ],
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  target: 'node',
  stats: {
    colors: true
  },
  devtool: 'source-map'
};