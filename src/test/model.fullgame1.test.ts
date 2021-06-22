import { Match } from '../models/Match';
import { Player } from '../models/Player';

test('success', (done) => {
  const player1 = new Player('Roscoe');

  const match = new Match(player1);

  const player2 = new Player('Alvera');

  match.setPlayer2(player2);

  // player 1 #1

  match.moveLeader('player1', { x: 3, y: 1 });

  let cardId = match.player1.hand[0]?.id || '';

  if (match.player1.hand[0]) match.player1.hand[0].attackPoints = 10;

  const player1CardIds: string[] = [];

  player1CardIds.push(cardId);

  match.playCard('player1', player1CardIds[0] || '', { x: 2, y: 2 });

  match.moveCard('player1', player1CardIds[0] || '', { x: 2, y: 3 });

  match.endTurn('player1');

  // player 2 #1

  match.moveLeader('player2', { x: 2, y: 6 });

  cardId = match.player2.hand[0]?.id || '';

  const player2CardIds: string[] = [];

  player2CardIds.push(cardId);

  match.playCard('player2', player2CardIds[0] || '', { x: 2, y: 5 });

  // match.setCard(card.id, 'defense');

  match.endTurn('player2');

  // player 1 #2

  match.moveLeader('player1', { x: 3, y: 2 });

  match.moveCard('player1', player1CardIds[0] || '', { x: 2, y: 4 });

  cardId = match.player1.hand[0]?.id || '';

  player1CardIds.push(cardId);

  match.playCard('player1', player1CardIds[1] || '', { x: 3, y: 3 });

  // match.setCard(card.id, 'flip');

  match.endTurn('player1');

  // player 2 #2

  match.moveLeader('player2', { x: 1, y: 6 });

  match.playCard('player2', match.player2.hand[0]?.id || '', { x: 1, y: 5 });

  match.endTurn('player2');

  // player 1 #3

  match.moveCard('player1', player1CardIds[0] || '', { x: 2, y: 5 }); // attack vs defense

  match.endTurn('player1');

  // player 2 #3

  match.endTurn('player2');

  // player 1 #4

  match.moveCard('player1', player1CardIds[0] || '', { x: 1, y: 5 }); // attack vs attack

  match.endTurn('player1');

  // player 2 #4

  match.endTurn('player2');

  // player 1 #5

  match.moveCard('player1', player1CardIds[0] || '', { x: 1, y: 6 }); // attack vs leader

  // match.result()

  done();
});
