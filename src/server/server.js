const express = require('express');
const debug = require('debug')('app:server');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const helmet = require('helmet');

const webpackConfig = require('../../webpack.config.js');
const config = require('./config/env');
const main = require('./routes/main.js');

const app = express();
app.use(express.static(`${__dirname}/public`));

if (config.mode === 'development') {
  debug('Loading on development mode.');

  const compiler = webpack(webpackConfig);
  const serverConfig = {
    contentBase: `http://localhost:${config.port}`,
    port: config.port,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true },
  };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  console.log('Loading production mode');
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

app.get('*', main);

app.listen(config.port, (err) => {
  if (err) debug(error);
  console.log(`Server running on http://localhost:${config.port}`);
});