interface ITerrainSlot {
  name: 'card' | 'leader';
  instance: any;
  owner?: IPlayerRef;
}

interface ITerrain {
  x: number;
  y: number;
  type: 'default';
  slot?: ITerrainSlot;
}
