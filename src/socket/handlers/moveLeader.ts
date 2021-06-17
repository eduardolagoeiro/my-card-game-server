import { Match } from '../../models/Match';
import util from './util';

const newMatch: ISocketHandler = ({ auth }: { auth: string }) => {
  const player = util.getPlayer(auth);

  const match = new Match(player);
  return ['matchCreated', { id: match.id }];
};

export default newMatch;
