import { v4 } from 'uuid';
import { Player } from './Player';
import positionHelper from '../helper/position';
import {
  ICard,
  IMatch,
  IMatchPlayer,
  IPlayerRef,
  IPosition,
  ITerrain,
} from '../types';

const INIT_LIFE_POINTS = 20;

const PLAYER_2_ALREADY_SETTED_ERROR = 'Player2AlreadySet';
const NOT_YOUR_TURN_ERROR = 'NotYourTurn';
const MATCH_NOT_READY_ERROR = 'MatchNotReady';
const HAS_OBSTACLE_ERROR = 'HasObstacle';
const OUT_OF_BOUNDS_ERROR = 'OutOfBounds';
const RANGE_ZERO_ERROR = 'RangeZero';
const NOT_IN_RANGE_ERROR = 'NotInRange';
const LEADER_IS_NOWHERE_ERROR = 'LeaderIsNowhere';
const MOVE_LEADER_LIMIT_REACHED_ERROR = 'MoveLeaderLimitReached';
const PLAY_CARD_LIMIT_REACHED_ERROR = 'PlayCardLimitReached';
const CARD_NOT_FOUND_ERROR = 'CardNotFound';
const MOVE_CARD_LIMIT_REACHED_ERROR = 'MoveCardLimitReached';
const FRIENDLY_FIRE_ERROR = 'FriendlyFireError';
const MATCH_ENDED_ERROR = 'MatchEndedError';

export class Match implements IMatch {
  id: string;
  map: Record<string, ITerrain>;
  turnOwner: string;
  player1: IMatchPlayer;
  player2: IMatchPlayer;
  winner: IPlayerRef | undefined;
  status: 'waiting' | 'ongoing' | 'ended';
  static storage: Map<string, Match> = new Map();

  static get(id: string): Match | undefined {
    return Match.storage.get(id);
  }

  constructor(player1: Player) {
    const map: Record<string, ITerrain> = {};
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        const terrain: ITerrain = {
          type: 'default',
        };
        map[positionHelper.toString({ x: i, y: j })] = terrain;
      }
    }
    this.status = 'waiting';
    this.map = map;
    this.turnOwner = 'player1';
    this.player1 = {
      turnActions: {
        playCard: {
          limit: 1,
          times: 0,
        },
        moveLeader: {
          limit: 1,
          times: 0,
        },
        moveCards: {
          limit: 1,
          cards: new Map(),
        },
      },
      player: player1,
      deck: player1.cards,
      hand: player1.cards.slice(0, 5),
      leader: {
        owner: 'player1',
        id: v4(),
      },
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
        moveLeader: {
          limit: 1,
          times: 0,
        },
        moveCards: {
          limit: 1,
          cards: new Map(),
        },
      },
      leader: {
        owner: 'player2',
        id: v4(),
      },
      lifePoints: INIT_LIFE_POINTS,
      deck: player2.cards,
      player: player2,
      hand: player2.cards.slice(0, 5),
    };
    this.placeLeader('player1', { x: 3, y: 0 });
    this.placeLeader('player2', { x: 3, y: 6 });
    this.status = 'ongoing';
  }

  throwIfNotReady() {
    if (this.status !== 'ongoing') {
      throw new Error(MATCH_NOT_READY_ERROR);
    }
  }

  throwIfMatchEnded() {
    if (this.status === 'ended') {
      throw new Error(MATCH_ENDED_ERROR);
    }
  }

  checkMatchEnded() {
    const p1win = this.player2.lifePoints <= 0;
    const p2win = this.player1.lifePoints <= 0;

    if (p1win || p2win) {
      this.status = 'ended';
    }

    if (p1win !== p2win) {
      if (p1win) {
        this.winner = 'player1';
      } else if (p2win) {
        this.winner = 'player2';
      }
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
    const posStr = positionHelper.toString(position);
    const terrain = this.map[posStr];
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
    const leader = this[player].leader;

    const terrain = this.getTerrain(position);
    this.throwIfObstacle(terrain);

    if (leader.position != undefined) {
      const oldTerrain = this.findTerrain(leader.position);
      delete oldTerrain?.slot;
    }

    terrain.slot = {
      leader,
    };

    leader.position = position;
  }

  placeCard(player: IPlayerRef, card: ICard, position: IPosition) {
    const terrain = this.getTerrain(position);
    this.throwIfObstacle(terrain);

    terrain.slot = {
      card: {
        instance: card,
        owner: player,
        position,
      },
    };
  }

  moveCard(player: IPlayerRef, cardId: string, position: IPosition) {
    const { moveCards } = this[player].turnActions;
    const moveCardTimes = moveCards.cards.get(cardId) || 0;
    if (moveCardTimes >= moveCards.limit) {
      throw new Error(MOVE_CARD_LIMIT_REACHED_ERROR);
    }

    const terrain = Object.values(this.map).find((t) => {
      return (
        t.slot?.card?.instance.id === cardId && t.slot.card.owner === player
      );
    });

    const card = terrain?.slot?.card;
    if (card === undefined) {
      throw new Error(CARD_NOT_FOUND_ERROR);
    }
    this.throwIfNotInRange(card.position, position);

    const targetTerrain = this.findTerrain(position);

    if (targetTerrain === undefined || targetTerrain.slot === undefined) {
      this.placeCard(player, card.instance, position);

      delete terrain?.slot;

      moveCards.cards.set(cardId, moveCardTimes + 1);
    } else if (targetTerrain.slot.leader !== undefined) {
      const enemy = targetTerrain.slot.leader.owner;

      if (enemy === player) {
        throw new Error(FRIENDLY_FIRE_ERROR);
      }

      this[enemy].lifePoints -= card.instance.attackPoints;

      moveCards.cards.set(card.instance.id, moveCardTimes + 1);
    } else if (targetTerrain.slot.card !== undefined) {
      const { owner: enemy } = targetTerrain.slot.card;

      if (enemy === player) {
        throw new Error(FRIENDLY_FIRE_ERROR);
      }

      const diffAtk =
        card.instance.attackPoints -
        targetTerrain.slot.card.instance.attackPoints;

      if (diffAtk > 0) {
        this[enemy].lifePoints -= diffAtk;

        delete targetTerrain?.slot;

        this.placeCard(player, card.instance, position);

        delete terrain?.slot;

        moveCards.cards.set(card.instance.id, moveCardTimes + 1);
      } else if (diffAtk < 0) {
        this[player].lifePoints += diffAtk;

        delete terrain?.slot;

        moveCards.cards.delete(card.instance.id);
      } else {
        moveCards.cards.set(card.instance.id, moveCardTimes + 1);
      }
    }
    this.checkMatchEnded();
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
    this.throwIfMatchEnded();
    this.throwIfNotReady();
    this.throwIfNotYourTurn(player);
    const { moveLeader } = this[player].turnActions;
    if (moveLeader.times >= moveLeader.limit) {
      throw new Error(MOVE_LEADER_LIMIT_REACHED_ERROR);
    }
    const oldPos = this.getLeaderPos(player);

    this.throwIfNotInRange(oldPos, position);
    this.placeLeader(player, position);
    moveLeader.times++;
  }

  endTurn(player: IPlayerRef) {
    this.throwIfMatchEnded();
    this.throwIfNotReady();
    this.throwIfNotYourTurn(player);
    const anotherRef = player === 'player1' ? 'player2' : 'player1';
    this.turnOwner = anotherRef;
    const anotherPlayer = this[anotherRef];
    anotherPlayer.turnActions.playCard.times = 0;
    anotherPlayer.turnActions.moveLeader.times = 0;
    anotherPlayer.turnActions.moveCards.cards = new Map();
    const cardPoped = anotherPlayer.deck.pop();
    if (cardPoped !== undefined) anotherPlayer.hand.push(cardPoped);
  }

  playCard(player: IPlayerRef, cardId: string, position: IPosition) {
    this.throwIfMatchEnded();
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
      card: {
        instance: card,
        owner: player,
        position,
      },
    };

    this[player].hand.splice(cardIndex, 1);

    card.position = position;

    playCard.times++;
  }
}
