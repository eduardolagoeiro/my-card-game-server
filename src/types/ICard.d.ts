interface ICard {
  name: string;
  color: string;
  type: 'magical' | 'trap' | 'monster';
  attackPoints: number;
  defensePoints: number;
  description: string;
}
