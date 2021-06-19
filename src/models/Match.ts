import { v4 } from 'uuid';
import { Player } from './Player';
const INIT_LIFE_POINTS = 4000;

const NOT_YOUR_TURN_ERROR = 'NotYourTurn';

interface ILeader {
  hasMoved: boolean;
  position?: IPosition;
}

interface IMatchPlayer {
  leader: ILeader;
  player: Player;
  lifePoints: number;
  cards: ICard[];
  hand: ICard[];
}

interface IMatch {
  turnOwner: string;
  player1: IMatchPlayer;
  player2?: IMatchPlayer;
  map: ITerrain[];
}

export class Match implements IMatch {
  id: string;
  map: ITerrain[];
  turnOwner: string;
  player1: IMatchPlayer;
  player2: IMatchPlayer;
  static storage: Map<string, Match> = new Map();

  static get(id: string): Match | undefined {
    return Match.storage.get(id);
  }

  constructor(player1: Player) {
    const map = [];
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        const terrain: ITerrain = {
          x: i,
          y: j,
          type: 'default',
        };
        map.push(terrain);
      }
    }
    this.map = map;
    this.turnOwner = 'player1';
    this.player1 = {
      player: player1,
      cards: player1.cards,
      hand: player1.cards.slice(0, 5),
      leader: { hasMoved: false },
      lifePoints: INIT_LIFE_POINTS,
    };

    this.id = v4();
    Match.storage.set(this.id, this);
  }

  setPlayer2(player2: Player) {
    if (this.player2) {
      throw new Error('Player2AlreadySet');
    }
    this.player2 = {
      leader: {
        hasMoved: false,
      },
      lifePoints: INIT_LIFE_POINTS,
      cards: player2.cards,
      player: player2,
      hand: player2.cards.slice(0, 5),
    };
    this.placeLeader('player1', { x: 3, y: 0 });
    this.placeLeader('player2', { x: 3, y: 6 });
  }

  isReady(): boolean {
    return !!this.player2;
  }

  throwIfNotReady() {
    if (!this.isReady()) {
      throw new Error('MatchNotReady');
    }
  }

  findTerrain(position: IPosition): ITerrain | undefined {
    const terrain = this.map.find(
      (el) => el.x === position.x && el.y === position.y
    );
    if (terrain === undefined) {
      throw new Error('OutOfBounds');
    }
    return terrain;
  }

  placeLeader(player: 'player1' | 'player2', position: IPosition) {
    const terrain = this.findTerrain(position);
    if (terrain === undefined) {
      throw new Error('OutOfBounds');
    }
    if (terrain.slot !== undefined) {
      throw new Error('HasObstacle');
    }
    terrain.slot = {
      instance: this[player].leader,
      name: 'leader',
      owner: player,
    };
    const oldPos = this[player].leader.position;
    if (oldPos != undefined) {
      const oldTerrain = this.findTerrain(oldPos);
      delete oldTerrain?.slot;
    }
    this[player].leader.position = position;
  }

  moveLeader(player: 'player1' | 'player2', position: IPosition) {
    this.throwIfNotReady();
    if (this.turnOwner !== player) {
      throw new Error(NOT_YOUR_TURN_ERROR);
    }
    if (this[player].leader.hasMoved === true) {
      throw new Error('AlreadyMoved');
    }
    const oldPos = this[player].leader.position || { x: 999, y: 999 };
    if (
      Math.abs(oldPos.x - position.x) + Math.abs(oldPos.y - position.y) !=
      1
    ) {
      throw new Error('NotInRange');
    }
    this.placeLeader(player, position);
    this[player].leader.hasMoved = true;
  }

  endTurn(player: 'player1' | 'player2') {
    this.throwIfNotReady();
    if (this.turnOwner === player) {
      const p = player === 'player1' ? 'player2' : 'player1';
      this.turnOwner = p;
      this[p].leader.hasMoved = false;
    } else {
      throw new Error(NOT_YOUR_TURN_ERROR);
    }
  }
}
