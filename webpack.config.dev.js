var webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

var indexHtmlConfig = {
	// favicon: __dirname + '/client/src/static/favicon.ico',
	template: path.join(__dirname + '/client/src/index.html'),
	filename: 'index.html',
	inject: true,
	hash: false
};
module.exports = {
	devtool: 'eval-source-map',
	// 页面入口文件配置
	entry: [
		'babel-polyfill',
		'whatwg-fetch',
		'eventsource-polyfill',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
		path.join(__dirname, "/client/src/index.js")
	],
	// 入口文件输出配置
	output: {
		path: path.join(__dirname, '/client/dist'),
		filename: 'js/bundle.js',
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
				path.join(__dirname, "/node_modules/"),
				path.join(__dirname, "client/src/styleReset/"),
			],
			loader: "style-loader!css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]" //加上modules即为启用css-modules，localIdentName是生成样式的命名规则
		}, {
			test: /\.css$/, //单独处理全局的样式，不使用css-modules
			include: [
				path.join(__dirname, "client/src/styleReset/"),
			],
			loader: "style-loader!css-loader"
		}, {
			test: /\.less$/, //处理antd样式，modifyVars自定义主题样式
			include: [
				path.join(__dirname, "node_modules/antd/"),
			],
			loader: "style-loader!css-loader!" + `less-loader?{"sourceMap":true}`
		}, {
			test: /\.(png|jpg)$/,
			loader: 'file-loader?name=img/[name]-[hash:5].[ext]'
		}]
	},
	// devServer: {
	//     hot: true,
	//     contentBase: path.join(__dirname, '/client/dist'),
	//     publicPath: '/',
	//     historyApiFallback: true
	// },
	plugins: [
		new HtmlWebpackPlugin(indexHtmlConfig),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		// new webpack.optimize.CommonsChunkPlugin({name:"vendor",filename: "js/vendor.js"})
	]
}