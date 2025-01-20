import { Tetromino } from '../types/tetris';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const INITIAL_SPEED = 1000;
export const SPEED_INCREASE = 0.85;
export const POINTS_PER_LINE = 100;
export const LINES_PER_LEVEL = 10;

export const TETROMINOES: { [key: string]: Tetromino } = {
  I: {
    shape: [[1, 1, 1, 1]],
    type: 'I',
    color: '#00f0f0'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    type: 'J',
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    type: 'L',
    color: '#f0a000'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    type: 'O',
    color: '#f0f000'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    type: 'S',
    color: '#00f000'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    type: 'T',
    color: '#a000f0'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    type: 'Z',
    color: '#f00000'
  }
};