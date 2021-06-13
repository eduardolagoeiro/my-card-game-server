import http from 'http';
import { Server } from 'socket.io';
import connection from './handlers/connection';

export default {
  init(server: http.Server) {
    const io = new Server(server);

    io.on('connection', connection(io));
    return io;
  },
};
