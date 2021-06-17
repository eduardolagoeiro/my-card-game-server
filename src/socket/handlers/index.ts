import newPlayer from './newPlayer';
import newMatch from './newMatch';
import enterMatch from './enterMatch';
import moveLeader from './moveLeader';

const handlers: Record<string, ISocketHandler> = {
  newPlayer,
  newMatch,
  enterMatch,
  moveLeader,
};

export default handlers;
