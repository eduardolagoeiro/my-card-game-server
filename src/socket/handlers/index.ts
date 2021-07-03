import newPlayer from './newPlayer';
import newMatch from './newMatch';
import enterMatch from './enterMatch';
import moveLeader from './moveLeader';
import getState from './getState';
import playCard from './playCard';
import moveCard from './moveCard';
import endTurn from './endTurn';
import { ISocketHandler } from '../../types';

const handlers: Record<string, ISocketHandler> = {
  newPlayer,
  newMatch,
  enterMatch,
  moveLeader,
  getState,
  playCard,
  moveCard,
  endTurn,
};

export default handlers;
