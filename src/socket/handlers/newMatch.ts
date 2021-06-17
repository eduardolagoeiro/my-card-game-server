import { Match } from '../../models/Match';
import { Player } from '../../models/Player';

const newMatch: ISocketHandler = ({ auth }: { auth: string }) => {
  const player = Player.get(auth);
  if (player === undefined) throw new Error('PlayerNotFound');

  const match = new Match(player);
  return ['matchCreated', { id: match.id }];
};

export default newMatch;
