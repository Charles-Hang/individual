import 'babel-polyfill';
import Koa from 'koa';
import views from 'koa-views';
import path from 'path';
const onerror = require('koa-onerror')
import bodyparser from 'koa-bodyparser';

const NODE_ENV = process.env.NODE_ENV;
console.log('node_env:', NODE_ENV);

import webpack from 'webpack';
import {
	devMiddleware,
	hotMiddleware
} from 'koa-webpack-middleware';
import devConfig from '../../webpack.config.dev.js';

const app = new Koa();
onerror(app);

if (NODE_ENV === 'development') {
	app.use(require('koa2-history-api-fallback')());
	const compile = webpack(devConfig);
	app.use(devMiddleware(compile, {
		noInfo: true,
		publicPath: devConfig.output.publicPath,
		stats: {
			colors: true,
			hash: false
		}
	}));
	app.use(hotMiddleware(compile));
}

app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}));


if (NODE_ENV === 'production') {
	app.use(require('koa-static')(path.join(__dirname, '../../client/dist')));

	app.use(views(path.join(__dirname, '../../client/dist'), {
		extension: 'html'
	}));
	const router = require('koa-router')();
	router.get('/*', async(ctx, next) => {
		await ctx.render('index');
	});
	app.use(router.routes(), router.allowedMethods());
}

app.on('error', (err, ctx) => {
	if (err.code !== 'ECONNRESET') {
		console.error('server error', err);
	}
});

app.listen(3000);