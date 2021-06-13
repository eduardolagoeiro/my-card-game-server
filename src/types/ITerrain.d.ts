interface ITerrainSlot {
  name: string;
  instance: any;
  owner?: 'player1' | 'player2';
}

interface ITerrain {
  x: number;
  y: number;
  type: 'default';
  slot?: ITerrainSlot;
}
