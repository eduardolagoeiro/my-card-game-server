import { ISocketHandler } from '../../types';
import util from './util';

const enterMatch: ISocketHandler = ({ matchId, auth }) => {
  const player = util.getPlayer(auth);

  const match = util.getMatch(matchId);

  match.setPlayer2(player);

  const [thisPlayer, enemy] = util.getPlayerRef(match, player);

  match[enemy].player.socket.emit('matchReady', util.getState(match, enemy));

  return ['matchReady', util.getState(match, thisPlayer)];
};

export default enterMatch;
