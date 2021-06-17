import newPlayer from './newPlayer';
import newMatch from './newMatch';
import enterMatch from './enterMatch';

const handlers: Record<string, ISocketHandler> = {
  newPlayer,
  newMatch,
  enterMatch,
};

export default handlers;
