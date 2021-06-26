interface ILeader {
  id: string;
  owner: IPlayerRef;
  position?: IPosition;
}

interface IPlayedCard {
  position: IPosition;
  instance: ICard;
  owner: IPlayerRef;
}

interface IMatchPlayer {
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
  player: Player;
  lifePoints: number;
  cards: ICard[];
  hand: ICard[];
}

interface IMatch {
  turnOwner: string;
  player1: IMatchPlayer;
  player2?: IMatchPlayer;
  map: Record<string, ITerrain>;
}
