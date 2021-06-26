import { Player } from '../../models/Player';
import { ISocketHandler } from '../../types';

const newPlayer: ISocketHandler = ({ socket, name }) => {
  const player = new Player(name);
  player.setSocket(socket);

  return ['playerCreated', { id: player.id }];
};

export default newPlayer;
