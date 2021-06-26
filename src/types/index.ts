export type IPlayerRef = 'player1' | 'player2';

export interface IPosition {
  x: number;
  y: number;
}

export interface ICard {
  id: string;
  name: string;
  color: string;
  type: 'magical' | 'trap' | 'monster';
  attackPoints: number;
  defensePoints: number;
  description: string;
  position?: IPosition;
}

export interface ILeader {
  id: string;
  owner: IPlayerRef;
  position?: IPosition;
}

export interface IPlayedCard {
  position: IPosition;
  instance: ICard;
  owner: IPlayerRef;
}

export interface IPlayerSocket {
  emit: (event: string, data?: any) => void;
}

export interface IPlayer {
  id: string;
  cards: ICard[];
  name: string;
  socket: IPlayerSocket;
}

export interface IMatchPlayer {
  turnActions: {
    playCard: {
      limit: number;
      times: number;
    };
    moveLeader: {
      limit: number;
      times: number;
    };
    moveCards: {
      limit: number;
      cards: Map<string, number>;
    };
  };
  leader: ILeader;
  player: IPlayer;
  lifePoints: number;
  deck: ICard[];
  hand: ICard[];
}

export interface IMatch {
  turnOwner: string;
  player1: IMatchPlayer;
  player2?: IMatchPlayer;
  map: Record<string, ITerrain>;
  winner: IPlayerRef | undefined;
  status: 'waiting' | 'ongoing' | 'ended';
}

export interface ITerrainSlot {
  leader?: ILeader;
  card?: IPlayedCard;
}

export interface ITerrain {
  type: 'default';
  slot?: ITerrainSlot;
}

export interface ISocketHandlerInput {
  auth: string;
  matchId: string;
  cardId: string;
  socket: any;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

export type ISocketHandler = (data: ISocketHandlerInput) => [string, any];
