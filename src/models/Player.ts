function create(name: string): IPlayer {
  const cards = [];
  for (let i = 0; i < 40; i += 1) {
    const card: ICard = {
      name: `${name}_${i}`,
      color: '#' + (Math.random() * 0xffffff).toString(16).split('.')[0],
      attackPoints: 1,
      defensePoints: 2,
      description: 'blalabla',
      type: 'monster',
    };
    cards.push(card);
  }
  return {
    name,
    cards,
  };
}

export default {
  create,
};
