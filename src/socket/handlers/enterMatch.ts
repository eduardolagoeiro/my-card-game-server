import { Match } from '../../models/Match';
import { Player } from '../../models/Player';

const enterMatch: ISocketHandler = (data) => {
  const { matchId, auth } = data;

  const player = Player.get(auth);
  if (player === undefined) throw new Error('PlayerNotFound');

  const match = Match.get(matchId);
  if (match === undefined) throw new Error('MatchNotFound');

  match.setPlayer2(player);
  match.player1.player.socket.emit('matchReady');

  return ['matchReady', null];
};

export default enterMatch;
