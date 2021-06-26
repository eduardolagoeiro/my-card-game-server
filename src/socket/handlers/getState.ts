import { ISocketHandler } from '../../types';
import util from './util';

const getState: ISocketHandler = ({ auth, matchId }) => {
  const player = util.getPlayer(auth);

  const match = util.getMatch(matchId);

  const [playerRef] = util.getPlayerRef(match, player);

  return ['state', util.getState(match, playerRef)];
};

export default getState;
