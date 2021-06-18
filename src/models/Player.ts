import { v4 } from 'uuid';

interface IPlayerSocket {
  emit: (event: string, data?: any) => void;
}

export class Player {
  id: string;
  cards: ICard[];
  name: string;
  socket: IPlayerSocket;

  static storage: Map<string, Player> = new Map();

  static get(id: string): Player | undefined {
    return Player.storage.get(id);
  }

  constructor(name: string) {
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
    this.cards = cards;
    this.name = name;
    this.id = v4();
    Player.storage.set(this.id, this);
  }

  setSocket(socket: IPlayerSocket) {
    this.socket = socket;
  }
}
