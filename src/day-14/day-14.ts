import { getInput, getLines } from "../utils/io";

const ROUNDED_ROCK = "O";
const CUBE_ROCK = "#";
const EMPTY = ".";

class Game {
  matrix: string[][];
  constructor(lines: string[]) {
    this.matrix = lines.map((line) => line.split(""));
  }

  tiltNorth() {
    for (let x = 0; x < this.matrix[0].length; x++) {
      let north = 0;
      for (let y = 0; y < this.matrix[0].length; y++) {
        if (this.matrix[y][x] === ROUNDED_ROCK) {
          this.matrix[north][x] = ROUNDED_ROCK;
          if (north !== y) {
            this.matrix[y][x] = EMPTY;
          }
          north++;
        } else if (this.matrix[y][x] === CUBE_ROCK) {
          north = y + 1;
        }
      }
    }
  }

  tiltWest() {
    for (let y = 0; y < this.matrix.length; y++) {
      let west = 0;
      for (let x = 0; x < this.matrix[0].length; x++) {
        if (this.matrix[y][x] === ROUNDED_ROCK) {
          this.matrix[y][west] = ROUNDED_ROCK;
          if (west !== x) {
            this.matrix[y][x] = EMPTY;
          }
          west++;
        } else if (this.matrix[y][x] === CUBE_ROCK) {
          west = x + 1;
        }
      }
    }
  }

  tiltSouth() {
    for (let x = 0; x < this.matrix[0].length; x++) {
      let south = this.matrix.length - 1;
      for (let y = south; y >= 0; y--) {
        if (this.matrix[y][x] === ROUNDED_ROCK) {
          this.matrix[south][x] = ROUNDED_ROCK;
          if (south !== y) {
            this.matrix[y][x] = EMPTY;
          }
          south--;
        } else if (this.matrix[y][x] === CUBE_ROCK) {
          south = y - 1;
        }
      }
    }
  }

  tiltEast() {
    for (let y = 0; y < this.matrix.length; y++) {
      let east = this.matrix[0].length - 1;
      for (let x = east; x >= 0; x--) {
        if (this.matrix[y][x] === ROUNDED_ROCK) {
          this.matrix[y][east] = ROUNDED_ROCK;
          if (east !== x) {
            this.matrix[y][x] = EMPTY;
          }
          east--;
        } else if (this.matrix[y][x] === CUBE_ROCK) {
          east = x - 1;
        }
      }
    }
  }

  tiltOneCycle() {
    this.tiltNorth();
    this.tiltWest();
    this.tiltSouth();
    this.tiltEast();
  }

  calculateRoundedRockWeight(): number {
    let count = 0;
    for (let x = 0; x < this.matrix[0].length; x++) {
      for (let y = 0; y < this.matrix.length; y++) {
        if (this.matrix[y][x] === ROUNDED_ROCK) {
          count += this.matrix.length - y;
        }
      }
    }
    return count;
  }

  solveOne() {
    this.tiltNorth();
  }

  solveSecond() {
    const history = [];
    const total = 1_000_000_000;
    for (let i = 0; i < total; i++) {
      const current = this.matrix.map((r) => r.join("")).join("\n");
      const index = history.indexOf(current);
      if (index >= 0) {
        this.matrix = history[index + ((total - i) % (history.length - index))]
          .split("\n")
          .map((r) => r.split(""));
        break;
      }
      history.push(current);
      this.tiltOneCycle();
    }
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const game = new Game(getLines(input));
  game.solveOne();
  return game.calculateRoundedRockWeight();
}

export function part2(inputFileName: string): number {
  const game = new Game(getLines(getInput(__dirname, inputFileName)));
  game.solveSecond();
  return game.calculateRoundedRockWeight();
}
