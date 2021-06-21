interface ITerrainSlotInstance {
  position?: IPosition;
  id: string;
}

interface ITerrainSlot {
  name: 'card' | 'leader';
  instance: ITerrainSlotInstance;
  owner?: IPlayerRef;
}

interface ITerrain {
  x: number;
  y: number;
  type: 'default';
  slot?: ITerrainSlot;
}
