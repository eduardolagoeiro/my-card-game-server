import { ISocketHandler } from '../../types';
import util from './util';

const endTurn: ISocketHandler = ({ matchId, auth }) => {
  const player = util.getPlayer(auth);

  const match = util.getMatch(matchId);

  const [thisPlayer, enemy] = util.getPlayerRef(match, player);

  match.endTurn(thisPlayer);

  return util.reflectAction(match, enemy, 'turnEnded', { ref: thisPlayer });
};

export default endTurn;
