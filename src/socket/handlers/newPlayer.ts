import { Socket } from 'socket.io';
import { Player } from '../../models/Player';

const newPlayer: ISocketHandler = ({
  socket,
  name,
}: {
  socket: Socket;
  name: string;
}) => {
  const player = new Player(name);
  player.setSocket(socket);

  return ['playerCreated', { id: player.id }];
};

export default newPlayer;
