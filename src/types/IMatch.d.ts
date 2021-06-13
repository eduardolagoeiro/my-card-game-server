interface ILeader {
  hasMoved: boolean;
}

interface IMatchPlayer {
  leader: ILeader;
  player: Player;
  lifePoints: number;
  cards: Card[];
  hand: Card[];
}

interface IMatch {
  turnOwner: string;
  player1: MatchPlayer;
  player2?: MatchPlayer;
  map: Terrain[];
}
