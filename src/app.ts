import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import path from 'path';

import apiRouter from './router/api';
import errorHandler from './router/error';

const app = express();

app.set('etag', false);

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': 'contentSecurityPolicy.dangerouslyDisableDefaultSrc',
        'script-src': 'self',
      },
    },
  })
);
app.use(morgan('tiny'));
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});

app.use('/fonts', express.static('fonts'));

app.use('/dist', express.static('dist'));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.use('/api', apiRouter);

app.use('/status', (_req, res) => {
  res.send('ok');
});

app.use('', (_req, _res, next) => {
  next({
    error: new Error('Not Found'),
    status: 404,
  });
});

app.use(errors());

app.use(errorHandler);

export default app;
