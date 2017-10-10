// @flow

import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from './config';
import index from './routes/index';
import NotFoundError from './lib/not-found-error';
// const path = require('path');
// const favicon = require('serve-favicon');

import type {$Request, $Response, NextFunction} from 'express';

const app = express();

// Uncomment after placing your favicon in /public.
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (config.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', index);

// Catch 404 and forward to error handler.
app.use((req: $Request, res: $Response, next: NextFunction) => {
  const err = new NotFoundError('Not Found');
  next(err);
});

if (config.get('env') === 'production') {
  // eslint-disable-next-line no-unused-vars
  app.use((err: Error, req: $Request, res: $Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });
} else {
  // Print stack traces in non-production envs.
  // eslint-disable-next-line no-unused-vars
  app.use((err: Error, req: $Request, res: $Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// Error handler.
// app.use((err: Error, req: $Request, res: $Response) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

export default app;
