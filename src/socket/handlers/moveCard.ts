import { ISocketHandler } from '../../types';
import util from './util';

const moveCard: ISocketHandler = ({ auth, matchId, cardId, position }) => {
  const player = util.getPlayer(auth);
  const match = util.getMatch(matchId);
  const [thisPlayer, enemy] = util.getPlayerRef(match, player);

  match.moveCard(thisPlayer, cardId, position);

  const sharedResult = { ref: thisPlayer, position, cardId };

  match[enemy].player.socket.emit('cardMoved', {
    state: util.getState(match, enemy),
    ...sharedResult,
  });

  return [
    'cardMoved',
    {
      state: util.getState(match, thisPlayer),
      ...sharedResult,
    },
  ];
};

export default moveCard;
