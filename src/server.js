import Express from 'express';
import session from 'express-session';
import React from 'react';
import Location from 'react-router/lib/Location';
import config from './config/config';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import createStore from './redux/createStore';
import universalRouter from './config/universalRouter';
import Html from './Html';
import PrettyError from 'pretty-error';

const pretty = new PrettyError();
const app = new Express();

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

let webpackStats;

if (!__DEVELOPMENT__) {
  webpackStats = require('../webpack-stats.json');
}

app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

app.use((req, res) => {

  if (__DEVELOPMENT__) {
    webpackStats = require('../webpack-stats.json');
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve('../webpack-stats.json')];
  }

  const store = createStore();
  const location = new Location(req.path, req.query);
  if (__DISABLE_SSR__) {
    res.send('<!doctype html>\n' +
        React.renderToString(<Html webpackStats={webpackStats} component={<div/>} store={store}/>));
  } else {
    universalRouter(location, undefined, store)
        .then(({component, transition, isRedirect}) => {
          if (isRedirect) {
            res.redirect(transition.redirectInfo.pathname);
            return;
          }
          res.send('<!doctype html>\n' +
              React.renderToString(<Html webpackStats={webpackStats} component={component} store={store}/>));
        })
        .catch((error) => {
          console.error('ROUTER ERROR:', pretty.render(error));
          res.status(500).send({error: error.stack});
        });
  }
});

if (config.port) {
  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    } 
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
