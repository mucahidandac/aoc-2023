import { getInput, getLines } from "../utils/io";

type TileShape = "." | "|" | "/" | "\\" | "-";
type Direction = "up" | "down" | "left" | "right";
type Line = TileShape[];
type Coords = { x: number; y: number };
type MapTile = {
  coords: Coords;
  shape: TileShape;
  visitedFromHistory: Coords[];
};
type Beam = {
  from: Coords;
  to: Coords;
  direction: Direction;
};

class Game {
  map: MapTile[][];
  constructor(lines: Line[]) {
    this.map = Array(lines.length).fill([]);
    for (let y = 0; y < lines.length; y++) {
      this.map[y] = Array(lines[y].length).fill({
        coords: { x: 0, y: 0 },
        shape: ".",
        visitedFromHistory: [],
      });
      for (let x = 0; x < lines[y].length; x++) {
        this.map[y][x] = {
          coords: { x, y },
          shape: lines[y][x],
          visitedFromHistory: [],
        };
      }
    }
  }

  getCoordinate(coords: Coords, direction: Direction): Coords {
    switch (direction) {
      case "up":
        return { x: coords.x, y: coords.y - 1 };
      case "down":
        return { x: coords.x, y: coords.y + 1 };
      case "left":
        return { x: coords.x - 1, y: coords.y };
      case "right":
        return { x: coords.x + 1, y: coords.y };
      default:
        throw new Error("Unknown direction");
    }
  }

  goVertical(currentTile: MapTile, goingUp?: boolean): Beam[] {
    if (currentTile.shape === "-") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, "left"),
          direction: "left",
        },
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, "right"),
          direction: "right",
        },
      ];
    }
    if (currentTile.shape === "\\") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(
            currentTile.coords,
            goingUp ? "left" : "right"
          ),
          direction: goingUp ? "left" : "right",
        },
      ];
    }
    if (currentTile.shape === "/") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(
            currentTile.coords,
            goingUp ? "right" : "left"
          ),
          direction: goingUp ? "right" : "left",
        },
      ];
    }
    if (currentTile.shape === "|" || currentTile.shape === ".") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, goingUp ? "up" : "down"),
          direction: goingUp ? "up" : "down",
        },
      ];
    }
    throw new Error(
      `Unknown shape [${currentTile.shape}] [${currentTile.coords.x}, ${currentTile.coords.y}]`
    );
  }
  goHorizontal(currentTile: MapTile, goingLeft?: boolean): Beam[] {
    if (currentTile.shape === "|") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, "up"),
          direction: "up",
        },
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, "down"),
          direction: "down",
        },
      ];
    }
    if (currentTile.shape === "\\") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, goingLeft ? "up" : "down"),
          direction: goingLeft ? "up" : "down",
        },
      ];
    }
    if (currentTile.shape === "/") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(currentTile.coords, goingLeft ? "down" : "up"),
          direction: goingLeft ? "down" : "up",
        },
      ];
    }
    if (currentTile.shape === "-" || currentTile.shape === ".") {
      return [
        {
          from: currentTile.coords,
          to: this.getCoordinate(
            currentTile.coords,
            goingLeft ? "left" : "right"
          ),
          direction: goingLeft ? "left" : "right",
        },
      ];
    }
    throw new Error(
      `Unknown shape [${currentTile.shape}] [${currentTile.coords.x}, ${currentTile.coords.y}]`
    );
  }
  getNextBeams(beam: Beam, currentTile: MapTile): Beam[] {
    switch (beam.direction) {
      case "up":
        return this.goVertical(currentTile, true);
      case "down":
        return this.goVertical(currentTile, false);
      case "left":
        return this.goHorizontal(currentTile, true);
      case "right":
        return this.goHorizontal(currentTile, false);
      default:
        throw new Error(
          `Unknown direction [${beam.direction}] [${beam.from.x}, ${beam.from.y}]`
        );
    }
  }
  isInMap(coords: Coords): boolean {
    return (
      coords.x >= 0 &&
      coords.x < this.map[0].length &&
      coords.y >= 0 &&
      coords.y < this.map.length
    );
  }
  traverseBeams(start: Beam) {
    const toBeVisited: Beam[] = [start];
    while (toBeVisited.length > 0) {
      const beam = toBeVisited.shift() as Beam;
      const currentTile = this.map[beam.to.y]?.[beam.to.x];
      if (!currentTile) {
        continue;
      }
      const isVisitedAlready = currentTile.visitedFromHistory.some(
        (coords) => coords.x === beam.from.x && coords.y === beam.from.y
      );
      if (isVisitedAlready) {
        continue;
      }
      currentTile.visitedFromHistory.push(beam.from);
      let nextBeams = this.getNextBeams(beam, currentTile).filter((beam) =>
        this.isInMap(beam.to)
      );
      if (nextBeams) {
        toBeVisited.push(...nextBeams);
      }
    }
  }

  getScore(): number {
    return this.map.reduce((acc, line) => {
      return (
        acc +
        line.reduce((acc, tile) => {
          return acc + (tile.visitedFromHistory.length ? 1 : 0);
        }, 0)
      );
    }, 0);
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const game = new Game(getLines(input).map((line) => line.split("") as Line));
  game.traverseBeams({
    from: { x: -1, y: 0 },
    to: { x: 0, y: 0 },
    direction: "right",
  });
  return game.getScore();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const inputs = getLines(input).map((line) => line.split("") as Line);
  const scores: number[] = [];
  for(let i = 0; i < inputs.length; i++) {
   // start from left to right
   const game = new Game(inputs);
   game.traverseBeams({
     from: { x: -1, y: i },
     to: { x: 0, y: i },
     direction: "right",
   });
    scores.push(game.getScore());
  }

  for(let i = 0; i < inputs[0].length; i++) {
   // start from top to bottom
   const game = new Game(inputs);
   game.traverseBeams({
     from: { x: i, y: -1 },
     to: { x: i, y: 0 },
     direction: "down",
   });
   scores.push(game.getScore());
  }

  for(let i = 0; i < inputs.length; i++) {
   // start from right to left
   const game = new Game(inputs);
   game.traverseBeams({
     from: { x: inputs[0].length, y: i },
     to: { x: inputs[0].length - 1, y: i },
     direction: "left",
   });
   scores.push(game.getScore());
  }

  for(let i = 0; i < inputs[0].length; i++) {
   // start from bottom to top
   const game = new Game(inputs);
   game.traverseBeams({
     from: { x: i, y: inputs.length },
     to: { x: i, y: inputs.length - 1 },
     direction: "up",
   });
   scores.push(game.getScore());
  }

  return Math.max(...scores);
}
