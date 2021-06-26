import io from './singleton';
import handlers from './handlers';
import debug from 'debug';

const log = debug('socket:server');

io.on('connection', (socket) => {
  log('connected', socket.id);
  socket.onAny((listener, data) => {
    log({ listener, data });
    if (typeof data !== 'object') {
      throw new Error('DataNotObject');
    }
    const fn = handlers[listener];
    if (typeof fn === 'function') {
      try {
        const [ackEvent, result] = fn({ ...data, socket });
        socket.emit(ackEvent, result);
      } catch (err) {
        log('error', err.message);
        socket.emit('error', err.message);
      }
    }
  });
});

export default io;
