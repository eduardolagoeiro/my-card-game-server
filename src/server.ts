import app from './app';
import db from './db';
import http from 'http';
import sockets from './sockets';
const server = http.createServer(app);

sockets.init(server);

async function init(): Promise<void> {
  await db.connect();
  const port = process.env.PORT || 4000;
  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`server running on port ${port}`);
      resolve();
    });
  });
}

init().catch(console.error);
