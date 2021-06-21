interface ILeader {
  id: string;
  position?: IPosition;
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
  map: ITerrain[];
}
