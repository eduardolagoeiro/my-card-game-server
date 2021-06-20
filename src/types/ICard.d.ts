interface ICard {
  id: string;
  name: string;
  color: string;
  type: 'magical' | 'trap' | 'monster';
  attackPoints: number;
  defensePoints: number;
  description: string;
  position?: IPosition;
}
