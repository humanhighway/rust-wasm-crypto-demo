const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ip = require('ip');
const dev = process.env.NODE_ENV !== 'production';

const webpackConfig = {
  mode: 'development',
  entry: './src/App.js',
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  devServer: {
    disableHostCheck: true,
    host: ip.address(),
    contentBase: ['dist'],
    watchContentBase: true,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    globalObject: 'this',
    publicPath: '',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules|vendor/],
        use: [{
          loader: 'babel-loader',
          options: {
            sourceMap: dev,
            cacheDirectory: true,
          }
        }],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: dev },
          }
        ],
      },
      {
        test: /\.worker.js$/,
        exclude: [/node_modules|vendor/],
        use: [{
          loader: 'workerize-loader',
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'visual',
      filename: 'index.html',
      template: 'template.html',
    })
  ]
};

module.exports = webpackConfig;
