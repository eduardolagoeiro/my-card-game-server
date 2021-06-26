import { Match } from '../../models/Match';
import { ISocketHandler } from '../../types';
import util from './util';

const newMatch: ISocketHandler = ({ auth }) => {
  const player = util.getPlayer(auth);

  const match = new Match(player);
  return ['matchCreated', { id: match.id }];
};

export default newMatch;
