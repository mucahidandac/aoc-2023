import { getInput, getLines } from "../utils/io";

type TileType = "." | "#";
type Color = string;

type Direction = "U" | "D" | "L" | "R";
const DirArray = ["R", "D", "L", "U"] as const;

type ParsedDirection = {
  direction: Direction;
  steps: number;
  hexCode: Color;
};

type Coords = {
  x: number;
  y: number;
};

function linesToDirections(lines: string[]): ParsedDirection[] {
  return lines.map((line) => {
    const [d, s, codeP] = line.split(" ");
    return {
      direction: d as Direction,
      steps: parseInt(s),
      hexCode: codeP.trim().replace("(", "").replace(")", ""),
    };
  });
}

function move(coords: Coords, direction: ParsedDirection): Coords {
  const { x, y } = coords;
  const { steps, direction: dir } = direction;
  switch (dir) {
    case "U":
      return { x, y: y + steps };
    case "D":
      return { x, y: y - steps };
    case "L":
      return { x: x - steps, y };
    case "R":
      return { x: x + steps, y };
  }
}

function measureArea(directions: ParsedDirection[]): number {
  let start: Coords = { x: 0, y: 0 };
  let perimeter = 0;
  let area = 0;

  directions.forEach((dir) => {
    const { x, y } = start;
    start = move(start, dir);
    perimeter += dir.steps;
    area += x * start.y - y * start.x;
  });
  const interior = Math.floor((Math.abs(area) - perimeter) / 2) + 1;
  return perimeter + interior;
}
export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const dirs = linesToDirections(lines);
  const area = measureArea(dirs);
  return area;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  let dirs = linesToDirections(lines);
  dirs = dirs.map((dir) => {
    const lengthHex = dir.hexCode.slice(1, 6);
    const lastNumStr = dir.hexCode.slice(dir.hexCode.length - 1);
    const lengthDecimal = parseInt(lengthHex, 16);
    const lastNum = parseInt(lastNumStr) % 4;
    const direction = DirArray[lastNum];
    return { hexCode: dir.hexCode, direction, steps: lengthDecimal };
  });
  const area = measureArea(dirs);
  return area;
}
