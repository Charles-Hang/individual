'use strict';

require('babel-polyfill');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaViews = require('koa-views');

var _koaViews2 = _interopRequireDefault(_koaViews);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaBetterBody = require('koa-better-body');

var _koaBetterBody2 = _interopRequireDefault(_koaBetterBody);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _router = require('./router/router.js');

var _router2 = _interopRequireDefault(_router);

var _user = require('./controllers/user.js');

var _user2 = _interopRequireDefault(_user);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _koaWebpackMiddleware = require('koa-webpack-middleware');

var _webpackConfigDev = require('../../webpack.config.dev.js');

var _webpackConfigDev2 = _interopRequireDefault(_webpackConfigDev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var onerror = require('koa-onerror');


var NODE_ENV = process.env.NODE_ENV;
console.log('node_env:', NODE_ENV);

var app = new _koa2.default();
onerror(app);

if (NODE_ENV === 'development') {
	// app.use(require('koa2-history-api-fallback')());
	var compile = (0, _webpack2.default)(_webpackConfigDev2.default);
	app.use((0, _koaWebpackMiddleware.devMiddleware)(compile, {
		noInfo: true,
		publicPath: _webpackConfigDev2.default.output.publicPath,
		stats: {
			colors: true,
			hash: false
		}
	}));
	app.use((0, _koaWebpackMiddleware.hotMiddleware)(compile));
} else {
	app.use(require('koa-static')(_path2.default.join(__dirname, '../../client/dist'), {
		maxage: 180 * 24 * 60 * 60 * 1000
	}));

	app.use((0, _koaViews2.default)(_path2.default.join(__dirname, '../../client/dist'), {
		extension: 'html'
	}));
}

app.use((0, _koaBetterBody2.default)());

app.use(_router2.default.routes(), _router2.default.allowedMethods());

// app.use(UController.initAdmin);

if (NODE_ENV === 'production') {
	var routerB = require('koa-router')();
	routerB.get('/*', function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return ctx.render('index');

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2) {
			return _ref.apply(this, arguments);
		};
	}());
	app.use(routerB.routes(), routerB.allowedMethods());
}

app.on('error', function (err, ctx) {
	if (err.code !== 'ECONNRESET') {
		console.error('server error', err);
	}
});

app.listen(3000);