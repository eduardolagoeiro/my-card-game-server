import { set, connect, connection } from 'mongoose';
import debug from 'debug';

const log = debug('infra:db');

set('useCreateIndex', true);

const mongourl = process.env.DB_URL || 'mongodb://localhost:27017/database';

export default {
  connect() {
    log(`connecting to ${mongourl}`);
    return connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((r) => {
      log('connected');
      return r;
    });
  },
  close() {
    return connection.close();
  },
};
