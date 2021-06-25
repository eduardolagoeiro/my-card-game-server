interface ITerrainSlot {
  leader?: ILeader;
  card?: IPlayedCard;
}

interface ITerrain {
  type: 'default';
  slot?: ITerrainSlot;
}
