import { getInput, getLines } from "../utils/io";

type Coords = {
  col: number;
  row: number;
};
type Universe = string[][];

class Game {
  map: Universe;
  galaxies: Coords[];
  emptyRows: number[];
  emptyCols: number[];

  constructor(lines: string[]) {
    this.map = [];
    this.galaxies = [];
    this.emptyRows = [];
    this.emptyCols = [];
    this.initializeMap(lines);
  }

  initializeMap(lines: string[]) {
    this.map = lines.map((line) => line.split(""));
    for (let y = 0; y < this.map.length; y++) {
      if (this.map[y].every((cell) => cell === ".")) {
        this.emptyRows.push(y);
      }
      if (this.map.every((row) => row[y] === ".")) {
        this.emptyCols.push(y);
      }
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === "#") {
          this.galaxies.push({ row: y, col: x });
        }
      }
    }
  }

  calculateDistance(g1: Coords, g2: Coords): number {
    return Math.abs(g1.row - g2.row) + Math.abs(g1.col - g2.col);
  }

  calculateDistanceWithSkipping(
    g1: Coords,
    g2: Coords,
    skipDistance: number
  ): number {
    let distance = this.calculateDistance(g1, g2);
    const biggerX = Math.max(g1.col, g2.col);
    const smallerX = Math.min(g1.col, g2.col);
    const biggerY = Math.max(g1.row, g2.row);
    const smallerY = Math.min(g1.row, g2.row);
    for (const row of this.emptyRows) {
      if (smallerY < row && row < biggerY) {
        distance += skipDistance - 1; // 1 for original empty tile
      }
    }
    for (const col of this.emptyCols) {
      if (smallerX < col && col < biggerX) {
        distance += skipDistance - 1;
      }
    }
    return distance;
  }

  calculateDistancesBetweenGalaxies(skipDistance: number = 1) {
    const pairs: Record<string, number> = {};
    for (let i = 0; i < this.galaxies.length; i++) {
      const galaxy = this.galaxies[i];
      for (let j = i + 1; j < this.galaxies.length; j++) {
        const otherGalaxy = this.galaxies[j];
        const pairKey = `${galaxy.row},${galaxy.col}-${otherGalaxy.row},${otherGalaxy.col}`;
        const otherPairKey = `${otherGalaxy.row},${otherGalaxy.col}-${galaxy.row},${galaxy.col}`;
        if (galaxy === otherGalaxy || pairs[pairKey] || pairs[otherPairKey]) {
          continue;
        }
        const distance = this.calculateDistanceWithSkipping(
          galaxy,
          otherGalaxy,
          skipDistance
        );
        pairs[pairKey] = distance;
      }
    }
    console.assert(
      Object.keys(pairs).length ===
        (this.galaxies.length * (this.galaxies.length - 1)) / 2,
      "Pairs length is not correct"
    );
    return Object.values(pairs);
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const game = new Game(lines);
  const distances = game.calculateDistancesBetweenGalaxies(2);
  return distances.reduce((acc, distance) => acc + distance, 0);
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const game = new Game(lines);
  const distances = game.calculateDistancesBetweenGalaxies(1_000_000);
  return distances.reduce((acc, distance) => acc + distance, 0);
}
