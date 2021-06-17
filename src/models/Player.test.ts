import { Player } from './Player';

describe('storage', () => {
  test('constructor', () => {
    const player = new Player('Ofelia');

    expect(player.id).toBeDefined();

    expect(Player.get(player.id)).toEqual(player);
  });
});
