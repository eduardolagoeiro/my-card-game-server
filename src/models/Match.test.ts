import { Match } from './Match';
import { Player } from './Player';

describe('create', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    expect(match).toBeDefined();
    expect(match.player1.player).toEqual(p1);
  });
});

describe('setPlayer2', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    expect(match).toBeDefined();
    expect(match.player2?.player).toEqual(p2);
  });

  test('fail on Player2AlreadySet', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const anotherPlayer2 = new Player('Vernie');

    expect(() => match.setPlayer2(anotherPlayer2)).toThrowError(
      'Player2AlreadySet'
    );
  });
});

describe('isReady', () => {
  test('is true', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    expect(match.isReady()).toEqual(true);
  });

  test('is false', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    expect(match.isReady()).toEqual(false);
  });
});

describe('moveLeader', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { y: 1, x: 3 };

    match.moveLeader('player1', position);

    const terrain = match.findTerrain(position);

    expect(terrain).toBeDefined();

    expect(terrain?.slot?.leader).toEqual(match.player1.leader);
  });

  test('fail on NotYourTurn', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { y: 1, x: 1 };

    expect(() => match.moveLeader('player2', position)).toThrowError(
      'NotYourTurn'
    );
  });

  test('fail on NotInRange', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { y: 0, x: 0 };

    expect(() => match.moveLeader('player1', position)).toThrowError(
      'NotInRange'
    );
  });

  test('fail on OutOfBounds', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { y: -1, x: 3 };

    expect(() => match.moveLeader('player1', position)).toThrowError(
      'OutOfBounds'
    );
  });

  test('fail on MoveLeaderLimitReached', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    match.moveLeader('player1', { y: 1, x: 3 });

    expect(() => match.moveLeader('player1', { y: 2, x: 3 })).toThrowError(
      'MoveLeaderLimitReached'
    );
  });

  test('fail on HasObstacle', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    match.placeLeader('player2', { y: 1, x: 3 });

    expect(() => match.moveLeader('player1', { y: 1, x: 3 })).toThrowError(
      'HasObstacle'
    );
  });
});

describe('endTurn', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    let match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    match.moveLeader('player1', { x: 3, y: 1 });

    const cardId = match.player1.hand[0]?.id || '';

    match.playCard('player1', cardId, { x: 3, y: 2 });

    match.moveCard('player1', cardId, { x: 3, y: 3 });

    match.endTurn('player1');

    expect(match.turnOwner).toEqual('player2');

    match.endTurn('player2');

    expect(match.turnOwner).toEqual('player1');

    expect(match.player1.turnActions.moveCards.cards.size).toEqual(0);
    expect(match.player1.turnActions.playCard.times).toEqual(0);
    expect(match.player1.turnActions.moveLeader.times).toEqual(0);
  });

  test('fail on MatchNotReady', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    expect(() => match.endTurn('player1')).toThrowError('MatchNotReady');
  });

  test('fail on NotYourTurn', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    expect(() => match.endTurn('player2')).toThrowError('NotYourTurn');
  });
});

describe('playCard', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 2, y: 1 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, position);

    const terrain = match.findTerrain(position);

    expect(terrain).toBeDefined();

    expect(terrain?.slot?.card).toMatchObject({
      owner: 'player1',
      instance: card,
      position,
    });

    expect(match.player1.hand.find(({ id }) => cardId === id)).toBeUndefined();
  });

  test('fail on MatchNotReady', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const position = { x: 3, y: 1 };

    expect(() =>
      match.playCard('player1', match.player1.hand[0]?.id || '', position)
    ).toThrowError('MatchNotReady');
  });

  test('fail on CardNotFound', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: 1 };

    const card = match.player2.hand[0];

    const cardId: string = card?.id || '';

    expect(() => match.playCard('player1', cardId, position)).toThrowError(
      'CardNotFound'
    );
  });

  test('fail on NotYourTurn', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: 1 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    expect(() => match.playCard('player2', cardId, position)).toThrowError(
      'NotYourTurn'
    );
  });

  test('fail on PlayCardLimitReached', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: 1 };

    match.playCard('player1', match.player1.hand[0]?.id || '', position);

    expect(() =>
      match.playCard('player1', match.player1.hand[0]?.id || '', position)
    ).toThrowError('PlayCardLimitReached');
  });

  test('fail on NotInRange', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: 2 }; // two squares ahead [3, 0]

    expect(() =>
      match.playCard('player1', match.player1.hand[0]?.id || '', position)
    ).toThrowError('NotInRange');
  });

  test('fail on OutOfBounds', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: -1 };

    expect(() =>
      match.playCard('player1', match.player1.hand[0]?.id || '', position)
    ).toThrowError('OutOfBounds');
  });

  test('fail on HasObstacle', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 3, y: 1 };

    const terrain = match.getTerrain(position);

    terrain.slot = {
      leader: match.player1.leader,
    };

    expect(() =>
      match.playCard('player1', match.player1.hand[0]?.id || '', position)
    ).toThrowError('HasObstacle');
  });
});

test('two leaders moving', () => {
  const p1 = new Player('Timmy');
  let match = new Match(p1);

  const p2 = new Player('Ebony');

  match.setPlayer2(p2);

  match.moveLeader('player1', { y: 1, x: 3 });

  match.endTurn('player1');

  match.moveLeader('player2', { y: 5, x: 3 });

  match.endTurn('player2');

  match.moveLeader('player1', { y: 2, x: 3 });

  match.endTurn('player1');

  match.moveLeader('player2', { y: 4, x: 3 });

  match.endTurn('player2');

  match.moveLeader('player1', { y: 3, x: 3 });

  match.endTurn('player1');

  expect(() => match.moveLeader('player2', { y: 3, x: 3 })).toThrowError(
    'HasObstacle'
  );
});

describe('get', () => {
  test('sucess', () => {
    new Match(new Player('Graham'));
    const m = new Match(new Player('Triston'));
    expect(Match.get(m.id)).toEqual(m);
  });
});

describe('throwIfNotInRange', () => {
  describe('defaults', () => {
    test('success NORTH', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));

      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: 1 }); // N
    });

    test('success SOUTH', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));

      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: -1 }); // S
    });

    test('success EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: 0 }); // E
    });

    test('success WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: 0 }); // W
    });

    test('fail on NotInRange NORTH EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(
        () => m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: 1 }) // NE
      ).toThrowError('NotInRange');
    });

    test('fail on NotInRange SOUTH EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(
        () => m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: -1 }) // SE
      ).toThrowError('NotInRange');
    });

    test('fail on NotInRange NORTH WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(
        () => m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: 1 }) // NW
      ).toThrowError('NotInRange');
    });

    test('fail on NotInRange SOUTH WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(
        () => m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: -1 }) // SW
      ).toThrowError('NotInRange');
    });

    test('fail on RangeZero', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(() =>
        m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: 0 })
      ).toThrowError('RangeZero');
    });

    test('accept RangeZero', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange(
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { isZeroValid: true }
      );
    });
  });

  describe('squared', () => {
    test('success NORTH', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));

      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: 1 }, { squared: true }); // N
    });

    test('success SOUTH', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));

      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: -1 }, { squared: true }); // S
    });

    test('success EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: 0 }, { squared: true }); // E
    });

    test('success WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: 0 }, { squared: true }); // W
    });

    test('success NORTH EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: 1 }, { squared: true }); // NE
    });

    test('success SOUTH EAST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: 1, y: -1 }, { squared: true }); // SE
    });

    test('success NORTH WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: 1 }, { squared: true }); // NW
    });

    test('success SOUTH WEST', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      m.throwIfNotInRange({ x: 0, y: 0 }, { x: -1, y: -1 }, { squared: true }); // SW
    });

    test('fail on RangeZero', () => {
      new Match(new Player('Graham'));
      const m = new Match(new Player('Triston'));
      expect(() =>
        m.throwIfNotInRange({ x: 0, y: 0 }, { x: 0, y: 0 })
      ).toThrowError('RangeZero');
    });
  });
});

describe('getLeaderPos', () => {
  test('success', () => {
    new Match(new Player('Graham'));
    const m = new Match(new Player('Triston'));
    m.setPlayer2(new Player('Ara'));
    expect(m.getLeaderPos('player1')).toMatchObject({ x: 3, y: 0 });
    expect(m.getLeaderPos('player2')).toMatchObject({ x: 3, y: 6 });
  });

  test('fail on LeaderIsNowhere', () => {
    new Match(new Player('Graham'));
    const m = new Match(new Player('Triston'));
    expect(() => m.getLeaderPos('player1')).toThrowError('LeaderIsNowhere');
  });
});

describe('moveCard', () => {
  test('success', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 2, y: 1 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, position);

    const to = { x: position.x, y: position.y + 1 };
    match.moveCard('player1', cardId, to);

    const terrainTo = match.getTerrain(to);

    expect(terrainTo.slot?.card).toEqual({
      instance: card,
      owner: 'player1',
      position: to,
    });

    expect(match.player1.turnActions.playCard.times).toEqual(1);
  });

  test('fail on CardNotFound', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const card = match.player2.hand[0];

    const cardId: string = card?.id || '';

    expect(() =>
      match.moveCard('player1', cardId, { x: 2, y: 1 })
    ).toThrowError('CardNotFound');
  });

  test('fail on MoveCardLimitReached', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, { x: 2, y: 1 });

    match.moveCard('player1', cardId, { x: 2, y: 2 });

    expect(() =>
      match.moveCard('player1', cardId, { x: 2, y: 3 })
    ).toThrowError('MoveCardLimitReached');
  });

  test('fail on NotInRange', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 2, y: 1 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, position);

    const to = { x: position.x, y: position.y + 2 };

    expect(() => match.moveCard('player1', cardId, to)).toThrowError(
      'NotInRange'
    );
  });

  test('fail on OutOfBounds', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 2, y: 0 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, position);

    const to = { x: position.x, y: -1 };

    expect(() => match.moveCard('player1', cardId, to)).toThrowError(
      'OutOfBounds'
    );
  });

  test('fail on FriendlyFireError', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const position = { x: 2, y: 0 };

    const card = match.player1.hand[0];

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, position);

    const to = { x: 3, y: 0 };

    expect(() => match.moveCard('player1', cardId, to)).toThrowError(
      'FriendlyFireError'
    );
  });

  test('card attack win', () => {
    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const cardp2 = match.player2.hand[0];

    if (cardp2 === undefined) throw new Error('card undef');

    cardp2.attackPoints = 1;

    match.placeCard('player2', cardp2, { x: 3, y: 1 });

    const card = match.player1.hand[0];

    if (card) card.attackPoints = 10;

    const cardId: string = card?.id || '';

    match.playCard('player1', cardId, { x: 2, y: 1 });

    match.moveCard('player1', cardId, { x: 3, y: 1 });

    expect(match.player2.lifePoints).toEqual(11);
  });

  test('card attack loose', () => {
    const to = { x: 3, y: 1 };

    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    const enemyCard = match.player2.hand[0];

    if (enemyCard !== undefined) {
      enemyCard.attackPoints = 5;

      match.placeCard('player2', enemyCard, to);
    }

    const attackerCard = match.player1.hand[0];

    if (attackerCard) {
      attackerCard.attackPoints = 3;

      const cardId: string = attackerCard?.id || '';

      match.playCard('player1', cardId, { x: 2, y: 1 });

      match.moveCard('player1', cardId, to);
    }

    const terrainTo = match.getTerrain(to);

    expect(terrainTo.slot?.card).toMatchObject({
      instance: enemyCard,
      owner: 'player2',
      position: to,
    });

    expect(match.player1.lifePoints).toEqual(18);
  });

  test('card attack leader', () => {
    const to = { x: 3, y: 1 };

    const p1 = new Player('Timmy');
    const match = new Match(p1);

    const p2 = new Player('Ebony');

    match.setPlayer2(p2);

    match.placeLeader('player2', to);

    const attackerCard = match.player1.hand[0];

    if (attackerCard) {
      attackerCard.attackPoints = 4;

      const cardId: string = attackerCard?.id || '';

      match.playCard('player1', cardId, { x: 2, y: 1 });

      match.moveCard('player1', cardId, to);
    }

    const terrainTo = match.getTerrain(to);

    expect(terrainTo.slot?.leader).toEqual(match.player2.leader);

    expect(match.player2.lifePoints).toEqual(16);
  });
});
