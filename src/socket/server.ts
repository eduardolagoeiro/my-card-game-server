import io from './singleton';
import handlers from './handlers';

io.on('connection', (socket) => {
  socket.onAny((listener, data) => {
    // console.log({ listener, data });
    if (typeof data !== 'object') {
      throw new Error('DataNotObject');
    }
    const fn = handlers[listener];
    if (typeof fn === 'function') {
      try {
        const [ackEvent, result] = fn({ ...data, socket });
        socket.emit(ackEvent, result);
      } catch (err) {
        socket.emit('error', err.message);
      }
    }
  });
});

export default io;
