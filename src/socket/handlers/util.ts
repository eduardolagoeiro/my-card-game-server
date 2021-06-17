import { MATCH_NOT_FOUND_ERROR, PLAYER_NOT_FOUND_ERROR } from './errors';
import { Player } from '../../models/Player';
import { Match } from '../../models/Match';

function getPlayer(auth: string): Player {
  const player = Player.get(auth);
  if (player === undefined) throw new Error(PLAYER_NOT_FOUND_ERROR);
  return player;
}

function getMatch(matchId: string): Match {
  const match = Match.get(matchId);
  if (match === undefined) throw new Error(MATCH_NOT_FOUND_ERROR);
  return match;
}

export default {
  getPlayer,
  getMatch,
};
