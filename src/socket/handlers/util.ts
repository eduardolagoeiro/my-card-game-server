import {
  MATCH_NOT_FOUND_ERROR,
  PLAYER_NOT_FOUND_ERROR,
  NOT_IN_THIS_MATCH_ERROR,
} from './errors';
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

function getPlayerRef(match: Match, player: Player): [IPlayerRef, IPlayerRef] {
  if (match.player1?.player === player) return ['player1', 'player2'];
  if (match.player2?.player === player) return ['player2', 'player1'];
  throw new Error(NOT_IN_THIS_MATCH_ERROR);
}

function reflectAction(
  match: Match,
  ref: IPlayerRef,
  event: string,
  data: any
): [string, any] {
  match[ref].player.socket.emit(event, data);
  return [event, data];
}

export default {
  reflectAction,
  getPlayer,
  getMatch,
  getPlayerRef,
};
