import { Player } from '../../models/Player';
import { Match } from '../../models/Match';
import {
  MATCH_NOT_FOUND_ERROR,
  NOT_IN_THIS_MATCH_ERROR,
  PLAYER_NOT_FOUND_ERROR,
} from './errors';
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

describe('reflectAction', () => {
  test('success', () => {
    const p = new Player('Cleta');

    const socketMock = { emit: jest.fn(() => {}) };

    p.setSocket(socketMock);

    const m = new Match(p);

    const data = { x: 1 };
    const event = 'event';

    const res = util.reflectAction(m, 'player1', event, data);

    expect(res[0]).toEqual(event);
    expect(res[1]).toEqual(data);

    const mockCall = socketMock.emit.mock.calls;
    const mockCall0 = mockCall[0] || [undefined, undefined];

    expect(mockCall.length).toEqual(1);
    expect(mockCall0[0]).toEqual(event);
    expect(mockCall0[1]).toEqual(data);
  });
});

describe('getPlayerRef', () => {
  test('sucess p1-p2', () => {
    const p = new Player('Cleta');

    const m = new Match(p);

    expect(util.getPlayerRef(m, p)).toEqual(['player1', 'player2']);
  });

  test('sucess p2-p1', () => {
    const m = new Match(new Player('Cleta'));

    const p2 = new Player('Derick');

    m.setPlayer2(p2);

    expect(util.getPlayerRef(m, p2)).toEqual(['player2', 'player1']);
  });

  test(`fail on ${NOT_IN_THIS_MATCH_ERROR}`, () => {
    const m = new Match(new Player('Cleta'));

    const p2 = new Player('Derick');
    expect(() => util.getPlayerRef(m, p2)).toThrowError(
      NOT_IN_THIS_MATCH_ERROR
    );
  });
});
