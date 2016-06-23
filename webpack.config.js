var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
  context: path.resolve('js'),
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './render'
    ]
  },

  output: {
    path: path.resolve('build/js/'),
    publicPath: '/public/assets/js/',
    filename: "[name].bundle.js"
  },

  resolve: {
    extensions: ['', '.js', '.css']
  },

  devServer: {
    contentBase: 'public'
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style!css!postcss"
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer];
  },

  watch: true,
  eslint: {
    configFile: './.eslintrc'
  }
};
