import { Match } from '../models/Match';
import { Player } from '../models/Player';

test('success', (done) => {
  const player1 = new Player('Roscoe');

  const match = new Match(player1);

  const player2 = new Player('Alvera');

  match.setPlayer2(player2);

  match.moveLeader('player1', { x: 3, y: 1 });

  // let card = match.player1.hand[0];

  // match.playCard('player1', card.id, { x: 2, y: 2});

  // match.moveCard(card.id, { x: 2, y: 3});

  match.endTurn('player1');

  match.moveLeader('player2', { x: 2, y: 6 });

  // card = match.player2.hand[0];

  // match.playCard('player2', card.id, { x: 2, y: 5});

  // match.setCard(card.id, 'defense');

  match.endTurn('player2');

  match.moveLeader('player1', { x: 3, y: 2 });

  // let fieldCards = match.getFieldCards('player1');

  // card = fieldCards[0];

  // match.moveCard(card.id, { x: 2, y: 4});

  // card = match.player1.hand[0];

  // match.playCard('player1', card.id, { x: 3, y: 3});

  // match.setCard(card.id, 'flip');

  match.endTurn('player1');

  match.moveLeader('player2', { x: 1, y: 6 });

  // card = match.player2.hand[0];

  // match.playCard('player2', card.id, { x: 1, y: 5});

  match.endTurn('player2');

  // let fieldCards = match.getFieldCards('player1');

  // card = fieldCards[0];

  // match.moveCard(card.id, { x: 2, y: 5}); // attack vs defense

  match.endTurn('player1');

  match.endTurn('player2');

  // match.moveCard(card.id, { x: 1, y: 5}); // attack vs attack

  match.endTurn('player1');

  match.endTurn('player2');

  // match.moveCard(card.id, { x: 1, y: 6}); // attack vs leader

  // match.result()

  done();
});
