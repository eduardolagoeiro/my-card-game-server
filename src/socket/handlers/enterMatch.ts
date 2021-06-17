import util from './util';

const enterMatch: ISocketHandler = (data) => {
  const { matchId, auth } = data;

  const player = util.getPlayer(auth);

  const match = util.getMatch(matchId);

  match.setPlayer2(player);
  match.player1.player.socket.emit('matchReady');

  return ['matchReady', null];
};

export default enterMatch;
