import { IPosition } from '../types';

export default {
  toString(pos: IPosition) {
    return `${pos.x}_${pos.y}`;
  },
};
