require('@babel/polyfill');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: __dirname + '/public/app',
    publicPath: '/app/',
    filename: 'bundle.js'
  },
  mode: 'production',
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
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
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
  }
};