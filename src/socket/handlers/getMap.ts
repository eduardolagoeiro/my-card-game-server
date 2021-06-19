import util from './util';

const getMap: ISocketHandler = ({ auth, matchId }) => {
  util.getPlayer(auth);

  const match = util.getMatch(matchId);

  return ['map', { map: match.map }];
};

export default getMap;
