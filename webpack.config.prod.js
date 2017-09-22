var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var indexHtmlConfig = {
    // favicon: __dirname + '/client/src/static/favicon.ico',
    template: path.join(__dirname, '/client/src/index.html'),
    filename: 'index.html',
    inject: true,
    hash: false
};
module.exports = {
    devtool: false,
    // 页面入口文件配置
    entry: {
        main: path.join(__dirname, '/client/src/index.js'),
        vendor: [
            'babel-polyfill',
            'whatwg-fetch',
            'react',
            'react-dom',
            'promise-polyfill',
            'react-router-dom',
        ]
    },
    // 入口文件输出配置
    output: {
        path: path.join(__dirname, '/client/dist'),
        filename: 'js/[name].[chunkhash:5].js',
        publicPath: '/'
    },
    module: {
        // 加载器配置
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            exclude: [
                path.join(__dirname, "node_modules/"),
                path.join(__dirname, "client/src/styleReset/")
            ],
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]"
            })
        }, {
            test: /\.css$/,
            include: [
                path.join(__dirname, "client/src/styleReset/")
            ],
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.less$/,
            include: [
                path.join(__dirname, "node_modules/antd/"),
            ],
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader!" + `less-loader?{"sourceMap":true}`
            })
        }, {
            test: /\.(png|jpg)$/,
            loader: 'file-loader?name=img/[name]-[hash:5].[ext]'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        new HtmlWebpackPlugin(indexHtmlConfig),
        new ExtractTextPlugin("css/index.[hash:5].css"),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UglifyJSPlugin({
            parallel: true,
            uglifyOptions: {
                compress: {
                    dead_code: true,
                    warnings: false,
                    drop_console: true,
                }
            }
        }),

    ]
};