import { v4 } from 'uuid';
import { Player } from './Player';

interface ILeader {
  hasMoved: boolean;
  position?: IPosition;
}

interface IMatchPlayer {
  turnActions: {
    playCard: {
      limit: number;
      times: number;
    };
  };
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

const INIT_LIFE_POINTS = 4000;

const PLAYER_2_ALREADY_SETTED_ERROR = 'Player2AlreadySet';
const NOT_YOUR_TURN_ERROR = 'NotYourTurn';
const MATCH_NOT_READY_ERROR = 'MatchNotReady';
const HAS_OBSTACLE_ERROR = 'HasObstacle';
const OUT_OF_BOUNDS_ERROR = 'OutOfBounds';
const RANGE_ZERO_ERROR = 'RangeZeroNotValid';
const NOT_IN_RANGE_ERROR = 'NotInRange';
const LEADER_IS_NOWHERE_ERROR = 'LeaderIsNowhere';
const ALREADY_MOVED_LEADER_ERROR = 'AlreadyMoved';
const PLAY_CARD_LIMIT_REACHED_ERROR = 'PlayCardLimitReached';
const CARD_NOT_FOUND_ERROR = 'CardNotFound';

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
      turnActions: {
        playCard: {
          limit: 1,
          times: 0,
        },
      },
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
      throw new Error(PLAYER_2_ALREADY_SETTED_ERROR);
    }
    this.player2 = {
      turnActions: {
        playCard: {
          limit: 1,
          times: 0,
        },
      },
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
      throw new Error(MATCH_NOT_READY_ERROR);
    }
  }

  throwIfNotYourTurn(player: IPlayerRef) {
    if (this.turnOwner !== player) {
      throw new Error(NOT_YOUR_TURN_ERROR);
    }
  }

  throwIfObstacle(terrain: ITerrain) {
    if (terrain.slot !== undefined) {
      throw new Error(HAS_OBSTACLE_ERROR);
    }
  }

  findTerrain(position: IPosition): ITerrain | undefined {
    const terrain = this.map.find(
      (el) => el.x === position.x && el.y === position.y
    );
    return terrain;
  }

  getTerrain(position: IPosition): ITerrain {
    const terrain = this.findTerrain(position);
    if (terrain === undefined) {
      throw new Error(OUT_OF_BOUNDS_ERROR);
    }
    return terrain;
  }

  placeLeader(player: IPlayerRef, position: IPosition) {
    const terrain = this.getTerrain(position);
    this.throwIfObstacle(terrain);
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

  throwIfNotInRange(
    pos0: IPosition,
    position: IPosition,
    opt: {
      maxRange?: number;
      isZeroValid?: boolean;
      squared?: boolean;
    } = {}
  ) {
    const options = {
      maxRange: 1,
      isZeroValid: false,
      squared: false,
      ...opt,
    };
    const deltaX = Math.abs(pos0.x - position.x);
    const deltaY = Math.abs(pos0.y - position.y);
    const distance = deltaX + deltaY;
    if (options.isZeroValid === false && distance === 0) {
      throw new Error(RANGE_ZERO_ERROR);
    }
    const maxRange = options.squared ? options.maxRange * 2 : options.maxRange;
    if (distance != 0 && distance > maxRange) {
      throw new Error(NOT_IN_RANGE_ERROR);
    }
    if (options.squared) {
      if (deltaX > maxRange / 2 || deltaY > maxRange / 2) {
        throw new Error(NOT_IN_RANGE_ERROR);
      }
    }
  }

  getLeaderPos(player: IPlayerRef) {
    const leaderPos = this[player].leader.position;
    if (leaderPos === undefined) throw new Error(LEADER_IS_NOWHERE_ERROR);
    return leaderPos;
  }

  moveLeader(player: IPlayerRef, position: IPosition) {
    this.throwIfNotReady();
    this.throwIfNotYourTurn(player);
    if (this[player].leader.hasMoved === true) {
      throw new Error(ALREADY_MOVED_LEADER_ERROR);
    }
    const oldPos = this.getLeaderPos(player);

    this.throwIfNotInRange(oldPos, position);
    this.placeLeader(player, position);
    this[player].leader.hasMoved = true;
  }

  endTurn(player: IPlayerRef) {
    this.throwIfNotReady();
    this.throwIfNotYourTurn(player);
    const p = player === 'player1' ? 'player2' : 'player1';
    this.turnOwner = p;
    this[p].leader.hasMoved = false;
  }

  playCard(player: IPlayerRef, cardId: string, position: IPosition) {
    this.throwIfNotReady();

    const { playCard } = this[player].turnActions;
    if (playCard.times >= playCard.limit) {
      throw new Error(PLAY_CARD_LIMIT_REACHED_ERROR);
    }
    this.throwIfNotYourTurn(player);

    const terrain = this.getTerrain(position);

    this.throwIfObstacle(terrain);

    const cardIndex = this[player].hand.findIndex((el) => el.id === cardId);

    const card = this[player].hand[cardIndex];

    if (card === undefined) throw new Error(CARD_NOT_FOUND_ERROR);

    const leaderPos = this.getLeaderPos(player);

    this.throwIfNotInRange(leaderPos, position, {
      squared: true,
    });

    terrain.slot = {
      name: 'card',
      instance: card,
      owner: player,
    };

    this[player].hand.splice(cardIndex, 1);

    card.position = position;

    playCard.times++;
  }
}
