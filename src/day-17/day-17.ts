import { getInput, getLines } from "../utils/io";

type Coords = {
  x: number;
  y: number;
};
type Direction = "up" | "down" | "left" | "right";
type Edge = {
  prev?: Edge;
  coords: Coords;
  direction: Direction;
  stepInSameDirection: number;
  totalCost: number;
};
const directionToArrow = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
} as const;

class VolcanoMap {
  map: number[][] = [];

  start: Coords;
  end: Coords;

  solution: [number, Edge[]] = [0, []];

  constructor(input: string) {
    const lines = getLines(input);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const row: number[] = [];
      for (let j = 0; j < line.length; j++) {
        const value = line[j];
        row.push(Number(value));
      }
      this.map.push(row);
    }
    this.start = { x: 0, y: 0 };
    this.end = { x: this.map[0].length - 1, y: this.map.length - 1 };
  }

  isWithinMap(coords: Coords): boolean {
    return (
      coords.x >= 0 &&
      coords.x < this.map[0].length &&
      coords.y >= 0 &&
      coords.y < this.map.length
    );
  }

  coordsToKey(coords: Coords): string {
    return `${coords.x},${coords.y}`;
  }

  edgeKey(edge: Edge): string {
    return `${this.coordsToKey(edge.coords)}:${edge.direction}:${
      edge.stepInSameDirection
    }`;
  }

  go(coord: Coords, direction: Direction): Coords {
    switch (direction) {
      case "up":
        return { x: coord.x, y: coord.y - 1 };
      case "down":
        return { x: coord.x, y: coord.y + 1 };
      case "left":
        return { x: coord.x - 1, y: coord.y };
      case "right":
        return { x: coord.x + 1, y: coord.y };
      default:
        throw new Error("Invalid direction");
    }
  }

  turn(coord: Coords, direction: Direction): [Coords, Direction][] {
    switch (direction) {
      case "up":
      case "down":
        return [
          [this.go(coord, "left"), "left"],
          [this.go(coord, "right"), "right"],
        ];
      case "left":
      case "right":
        return [
          [this.go(coord, "up"), "up"],
          [this.go(coord, "down"), "down"],
        ];
      default:
        throw new Error("Invalid direction");
    }
  }

  compareCoords(a: Coords, b: Coords): boolean {
    return a.x === b.x && a.y === b.y;
  }

  printSolution() {
    const clone = this.map.map((row) => [...row]) as (string | number)[][];
    this.solution[1].forEach((point) => {
      clone[point.coords.y][point.coords.x] = directionToArrow[point.direction];
    });
    console.table(clone);
  }

  solveOne(): number {
    this.solution = this.findShortestPath(0, 3);
    return this.solution[0];
  }

  solveTwo(): number {
    this.solution = this.findShortestPath(4, 10);
    return this.solution[0];
  }

  findShortestPath(
    minMovesInSameDirection: number,
    maxMovesInSameDirection: number
  ): [number, Edge[]] {
    let totalCost = 0;
    const visited = new Set<string>();

    let edgeNetwork: Edge[] = [
      {
        coords: this.go(this.start, "right"),
        direction: "right",
        stepInSameDirection: 1,
        totalCost: this.map[this.start.y][this.start.x],
      },
      {
        coords: this.go(this.start, "down"),
        direction: "down",
        stepInSameDirection: 1,
        totalCost: this.map[this.start.y][this.start.x],
      },
    ];
    while (edgeNetwork.length > 0) {
      const newEdges: Edge[] = [];

      for (const edge of edgeNetwork) {
        const key = this.edgeKey(edge);
        if (visited.has(key)) {
          continue;
        }

        if (edge.totalCost > totalCost) {
          newEdges.push(edge);
          continue;
        }

        // if (edge.totalCost < totalCost) throw "Unexpectedly skipped edge";

        if (
          this.compareCoords(edge.coords, this.end) &&
          edge.stepInSameDirection >= minMovesInSameDirection
        ) {
          const backtrack: Edge[] = [];
          let current = edge;
          while (current.prev) {
            backtrack.push(current);
            current = current.prev;
          }
          backtrack.push(current);
          return [edge.totalCost, backtrack.reverse()];
        }
        visited.add(key);

        if (edge.stepInSameDirection < maxMovesInSameDirection) {
          const newCoord = this.go(edge.coords, edge.direction);
          if (this.isWithinMap(newCoord)) {
            newEdges.push({
              prev: edge,
              coords: newCoord,
              direction: edge.direction,
              stepInSameDirection: edge.stepInSameDirection + 1,
              totalCost: edge.totalCost + this.map[newCoord.y][newCoord.x],
            });
          }
        }

        if (edge.stepInSameDirection >= minMovesInSameDirection) {
          const coordsList = this.turn(edge.coords, edge.direction);
          for (const [coords, direction] of coordsList) {
            if (this.isWithinMap(coords)) {
              newEdges.push({
                prev: edge,
                coords,
                direction,
                stepInSameDirection: 1,
                totalCost: edge.totalCost + this.map[coords.y][coords.x],
              });
            }
          }
        }
      }

      edgeNetwork = newEdges;
      totalCost++;
    }
    throw new Error("No path found");
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const volcanoMap = new VolcanoMap(input);
  const result = volcanoMap.solveOne();
  return result;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const volcanoMap = new VolcanoMap(input);
  const result = volcanoMap.solveTwo();
  return result;
}
