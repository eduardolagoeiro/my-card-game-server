import { ISocketHandler } from '../../types';
import util from './util';

const moveLeader: ISocketHandler = ({ auth, matchId, position }) => {
  const player = util.getPlayer(auth);
  const match = util.getMatch(matchId);

  const [thisPlayer, anotherPlayer] = util.getPlayerRef(match, player);
  match.moveLeader(thisPlayer, position);

  return util.reflectAction(match, anotherPlayer, 'leaderMoved', {
    ref: thisPlayer,
    position,
  });
};

export default moveLeader;
