import app from './app';
import db from './db';
import http from 'http';
import socketServer from './socket';
import debug from 'debug';

const log = debug('infra:server');

const httpServer = http.createServer(app);

socketServer.attach(httpServer);

async function init(): Promise<void> {
  await db.connect();
  const port = process.env.PORT || 4000;
  return new Promise((resolve) => {
    httpServer.listen(port, () => {
      log(`server running on port ${port}`);
      resolve();
    });
  });
}

async function close(): Promise<void> {
  await db.close();
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export default {
  init,
  httpServer: httpServer,
  socketServer: socketServer,
  close,
};
