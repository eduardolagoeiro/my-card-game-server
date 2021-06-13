import { set, connect } from 'mongoose';

set('useCreateIndex', true);

const mongourl = process.env.DB_URL || 'mongodb://localhost:27017/database';

export default {
  connect() {
    console.log(`connecting to ${mongourl}`);
    return connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((r) => {
      console.log('connected');
      r;
    });
  },
};
