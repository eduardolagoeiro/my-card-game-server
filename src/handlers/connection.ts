import { Server, Socket } from 'socket.io';
import Match from '../models/Match';
import Player from '../models/Player';

const matchLimit = 2;
let matchWaitingPlayerKey: number = 0;
const matches = new Map();

export default function connection(io: Server) {
  return function (socket: Socket) {
    if (matches.size >= matchLimit) {
      socket.disconnect();
    } else if (matchWaitingPlayerKey === 0) {
      const player1 = Player.create(socket.id);
      matchWaitingPlayerKey = new Date().getTime();
      matches.set(new Date().getTime(), Match.create(player1));
      socket.emit('waiting another player');
    } else {
      const player2 = Player.create(socket.id);
      const match = matches.get(matchWaitingPlayerKey);
      matches.set(matchWaitingPlayerKey, Match.setPlayer2(match, player2));
      io.sockets.to(match.player1.player.name).emit('gameReady');
      socket.emit('gameReady');

      matchWaitingPlayerKey = 0;
    }
  };
}
