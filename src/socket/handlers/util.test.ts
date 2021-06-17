import { Player } from '../../models/Player';
import { Match } from '../../models/Match';
import { MATCH_NOT_FOUND_ERROR, PLAYER_NOT_FOUND_ERROR } from './errors';
import util from './util';

describe('getMatch', () => {
  test('success', () => {
    const p = new Player('Cleta');
    const m = new Match(p);
    expect(util.getMatch(m.id)).toEqual(m);
  });
  test(`fail on ${MATCH_NOT_FOUND_ERROR}`, () => {
    expect(() => util.getMatch('')).toThrowError(MATCH_NOT_FOUND_ERROR);
  });
});

describe('getPlayer', () => {
  test('success', () => {
    const p = new Player('Cleta');
    expect(util.getPlayer(p.id)).toEqual(p);
  });
  test(`fail on ${PLAYER_NOT_FOUND_ERROR}`, () => {
    expect(() => util.getPlayer('')).toThrowError(PLAYER_NOT_FOUND_ERROR);
  });
});
