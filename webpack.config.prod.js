const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const indexHtmlConfig = {
  favicon: path.join(__dirname, '/client/src/static/img/favicon.ico'),
  template: path.join(__dirname, '/client/src/index.html'),
  filename: 'index.html',
  inject: true,
  hash: false,
};
module.exports = {
  devtool: false,
  // 页面入口文件配置
  entry: {
    main: path.join(__dirname, '/client/src/index.jsx'),
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'react',
      'react-dom',
      'promise-polyfill',
      'react-router-dom',
    ],
  },
  // 入口文件输出配置
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'js/[name].[chunkhash:5].js',
    chunkFilename: 'js/[name].[chunkhash:5].js',
    publicPath: 'https://static.noonstar.cn/',
  },
  resolve: {
    extensions: [' ', '.js', '.jsx', '.json', '.css'],
  },
  module: {
    // 加载器配置
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      exclude: [
        path.join(__dirname, 'node_modules/'),
        path.join(__dirname, 'client/src/styleReset/'),
      ],
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]&minimize',
        }],
      }),
    }, {
      test: /\.css$/,
      include: [
        path.join(__dirname, 'client/src/styleReset/'),
        path.join(__dirname, 'node_modules/simplemde'),
      ],
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader?minimize',
        }],
      }),
    }, {
      test: /\.less$/,
      include: [
        path.join(__dirname, 'node_modules/antd/'),
      ],
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader?minimize!less-loader?{"sourceMap":true}',
      }),
    }, {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=img/[name]-[hash:5].[ext]',
    }],
  },
  plugins: [
    new CleanWebpackPlugin([path.join(__dirname, '/client/dist')]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
    }),
    new HtmlWebpackPlugin(indexHtmlConfig),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['main', 'vendor', 'runtime', 'index'],
    }),
    new ExtractTextPlugin('css/index.[chunkhash:5].css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        compress: {
          dead_code: true,
          warnings: false,
          drop_console: true,
        },
      },
    }),
  ],
};
