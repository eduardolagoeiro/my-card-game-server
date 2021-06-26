import { ISocketHandler } from '../../types';
import util from './util';

const moveCard: ISocketHandler = ({ auth, matchId, cardId, position }) => {
  const player = util.getPlayer(auth);
  const match = util.getMatch(matchId);
  const [thisPlayer, anotherPlayer] = util.getPlayerRef(match, player);

  match.moveCard(thisPlayer, cardId, position);

  return util.reflectAction(match, anotherPlayer, 'cardMoved', {
    ref: thisPlayer,
    position,
    cardId,
  });
};

export default moveCard;
