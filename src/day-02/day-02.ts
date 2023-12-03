import { getInput, getLines } from "../utils/io";

type Color = 'red' | 'green' | 'blue';
// only 12 red cubes, 13 green cubes, and 14 blue cubes
const limits: Record<Color, number> = {
  red: 12,
  green: 13,
  blue: 14,
};


function checkGameFirst(line: string): number {
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const [gameLabel, gameOutput] = line.split(":");
  // Game 1
  const [_, gameId] = gameLabel.trim().split(" ");
  // 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const sets = gameOutput.trim().split(";");

  for (const set of sets) {
    // 3 blue, 4 red
    const setPieces = set.trim().split(",");
    for (const setPiece of setPieces) {
      // 3 blue
      const [count, color] = setPiece.trim().split(" ");
      if (limits[color as Color] < Number(count)) {
        return 0;
      }
    }
  }
  return Number(gameId);
}

function checkGameSecond(line: string): number {
  let minimalLimits: Record<Color, number> = {
    red: 0,
    green: 0,
    blue: 0
  };
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const [gameLabel, gameOutput] = line.split(":");
  // Game 1
  const [_, gameId] = gameLabel.trim().split(" ");
  // 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const sets = gameOutput.trim().split(";");

  for (const set of sets) {
    // 3 blue, 4 red
    const setPieces = set.trim().split(",");
    for (const setPiece of setPieces) {
      // 3 blue
      const [count, color] = setPiece.trim().split(" ");
      if (minimalLimits[color as Color] < Number(count)) {
        minimalLimits[color as Color] = Number(count);
      }
    }
  }
  return minimalLimits.blue * minimalLimits.green * minimalLimits.red;
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  let validGames = 0;
  for (const line of lines) {
    validGames += checkGameFirst(line);
  }
  return validGames;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  let validGames = 0;
  for (const line of lines) {
    validGames += checkGameSecond(line);
  }
  return validGames;
}
