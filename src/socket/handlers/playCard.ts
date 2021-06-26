import { ISocketHandler } from '../../types';
import util from './util';

const playCard: ISocketHandler = ({ auth, matchId, cardId, position }) => {
  const player = util.getPlayer(auth);
  const match = util.getMatch(matchId);
  const [thisPlayer, enemy] = util.getPlayerRef(match, player);

  match.playCard(thisPlayer, cardId, position);

  return util.reflectAction(match, enemy, 'cardPlayed', {
    ref: thisPlayer,
    position,
    cardId,
  });
};

export default playCard;
