import { Match } from './Match';
import Player from './Player';

describe('Match.create', () => {
  test('success', () => {
    const p1 = Player.create('Timmy');
    const match = new Match(p1);

    expect(match).toBeDefined();
    expect(match.player1.player).toEqual(p1);
  });
});

describe('Match.setPlayer2', () => {
  test('success', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    expect(match).toBeDefined();
    expect(match.player2?.player).toEqual(p2);
  });

  test('fail on Player2AlreadySet', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    const anotherPlayer2 = Player.create('Vernie');

    expect(() => match.setPlayer2(anotherPlayer2)).toThrowError(
      'Player2AlreadySet'
    );
  });
});

describe('Match.isReady', () => {
  test('is true', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    expect(match.isReady()).toEqual(true);
  });

  test('is false', () => {
    const p1 = Player.create('Timmy');
    const match = new Match(p1);

    expect(match.isReady()).toEqual(false);
  });
});

describe('Match.moveLeader', () => {
  test('success', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    const position = { x: 1, y: 3 };

    match.moveLeader('player1', position);

    const terrain = match.map.find(
      (el) => el.x === position.x && el.y === position.y
    );

    expect(terrain).toBeDefined();

    expect(terrain?.slot?.name).toEqual('leader');

    expect(terrain?.slot?.name).toEqual('leader');
  });

  test('fail on NotYourTurn', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    const position = { x: 1, y: 1 };

    expect(() => match.moveLeader('player2', position)).toThrowError(
      'NotYourTurn'
    );
  });

  test('fail on OutOfBounds', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    const position = { x: 10, y: 0 };

    expect(() => match.moveLeader('player1', position)).toThrowError(
      'OutOfBounds'
    );
  });

  test('fail on AlreadyMoved', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    match.moveLeader('player1', { x: 1, y: 3 });

    expect(() => match.moveLeader('player1', { x: 2, y: 3 })).toThrowError(
      'AlreadyMoved'
    );
  });

  test('fail on HasObstacle', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    match.placeLeader('player2', { x: 1, y: 3 });

    expect(() => match.moveLeader('player1', { x: 1, y: 3 })).toThrowError(
      'HasObstacle'
    );
  });
});

describe('Match.endTurn', () => {
  test('success', () => {
    const p1 = Player.create('Timmy');
    let match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    match.endTurn('player1');

    expect(match.turnOwner).toEqual('player2');
  });

  test('fail on MatchNotReady', () => {
    const p1 = Player.create('Timmy');
    const match = new Match(p1);

    expect(() => match.endTurn('player1')).toThrowError('MatchNotReady');
  });

  test('fail on NotYourTurn', () => {
    const p1 = Player.create('Timmy');
    const match = new Match(p1);

    const p2 = Player.create('Ebony');

    match.setPlayer2(p2);

    expect(() => match.endTurn('player2')).toThrowError('NotYourTurn');
  });
});

test('two leaders moving', () => {
  const p1 = Player.create('Timmy');
  let match = new Match(p1);

  const p2 = Player.create('Ebony');

  match.setPlayer2(p2);

  match.moveLeader('player1', { x: 1, y: 3 });

  match.endTurn('player1');

  match.moveLeader('player2', { x: 6, y: 3 });

  match.endTurn('player2');

  match.moveLeader('player1', { x: 2, y: 3 });

  match.endTurn('player1');

  match.moveLeader('player2', { x: 5, y: 3 });

  match.endTurn('player2');

  match.moveLeader('player1', { x: 3, y: 3 });

  match.endTurn('player1');

  match.moveLeader('player2', { x: 4, y: 3 });

  match.endTurn('player2');

  expect(() => match.moveLeader('player1', { x: 4, y: 3 })).toThrowError(
    'HasObstacle'
  );
});
