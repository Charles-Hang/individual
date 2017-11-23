import 'babel-polyfill';
import Koa from 'koa';
import views from 'koa-views';
import path from 'path';
import body from 'koa-better-body';

import webpack from 'webpack';
import {
  devMiddleware,
  hotMiddleware,
} from 'koa-webpack-middleware';
import devConfig from '../../webpack.config.dev';
import router from './router/router';

const onerror = require('koa-onerror');

const { NODE_ENV } = process.env;
console.log('node_env:', NODE_ENV);

const app = new Koa();
onerror(app);

if (NODE_ENV === 'development') {
  // app.use(require('koa2-history-api-fallback')());
  const compile = webpack(devConfig);
  app.use(devMiddleware(compile, {
    noInfo: true,
    publicPath: devConfig.output.publicPath,
    stats: {
      colors: true,
      hash: false,
    },
  }));
  app.use(hotMiddleware(compile));
} else {
  app.use(require('koa-static')(path.join(__dirname, '../../client/dist'), {
    maxage: 180 * 24 * 60 * 60 * 1000,
  }));

  app.use(views(path.join(__dirname, '../../client/dist'), {
    extension: 'html',
  }));
}

app.use(body());

app.use(router.routes(), router.allowedMethods());

// app.use(UController.initAdmin);

if (NODE_ENV === 'production') {
  const routerB = require('koa-router')();
  routerB.get('/*', async (ctx) => {
    await ctx.render('index');
  });
  app.use(routerB.routes(), routerB.allowedMethods());
}

app.on('error', (err) => {
  if (err.code !== 'ECONNRESET') {
    console.error('server error', err);
  }
});

app.listen(3000);
