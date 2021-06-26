import newPlayer from './newPlayer';
import newMatch from './newMatch';
import enterMatch from './enterMatch';
import moveLeader from './moveLeader';
import getMap from './getMap';
import { ISocketHandler } from '../../types';

const handlers: Record<string, ISocketHandler> = {
  newPlayer,
  newMatch,
  enterMatch,
  moveLeader,
  getMap,
};

export default handlers;
