import { ISocketHandler } from '../../types';
import util from './util';

const enterMatch: ISocketHandler = ({ matchId, auth }) => {
  const player = util.getPlayer(auth);

  const match = util.getMatch(matchId);

  match.setPlayer2(player);

  return util.reflectAction(match, 'player1', 'matchReady', { map: match.map });
};

export default enterMatch;
