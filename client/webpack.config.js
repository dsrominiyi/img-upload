require('@babel/polyfill');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: __dirname + '/public/app',
    publicPath: '/app/',
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['@babel/env', '@babel/react']
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap',
        exclude: /node_modules/
      }
    ],
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd'
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/public',
    publicPath: '/app/',
    historyApiFallback: true,
    compress: true,
    inline: true,
    port: 3000
  }
};