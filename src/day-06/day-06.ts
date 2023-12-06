import { getInput, getLines } from "../utils/io";

class Race {
  constructor(private raceTimeMs: number, private distanceToPass: number) {}

  countWinCasesRawMs() {
    // wait + move = raceTime
    // wait * move = distanceToPass)

    let wait = 0;
    let move = this.raceTimeMs;
    const half = this.raceTimeMs/2;
    while (wait * move <= this.distanceToPass && wait < half) {
      wait++;
      move = this.raceTimeMs - wait;
    }
    return Math.abs(move - wait) + 1;
  }

  quadraticFormulaSolution() {
    // ax^2 + bx + c = 0 is a Quadratic equation where
    // a = 1, b = raceTime, c = distanceToPass
    const b = this.raceTimeMs;
    const c = this.distanceToPass;
    const discriminant = Math.abs(b * b - 4 * c);
    const r1 = (-b + Math.sqrt(discriminant)) / 2;
    const r2 = (-b - Math.sqrt(discriminant)) / 2;
    return Math.floor(r1 - r2);
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const [times, distances] = getLines(input)
    .filter(Boolean)
    .map((line) => line.trim().split(":")[1].trim().split(/\s+/g).map(Number));
  const races = times.map((time, i) => new Race(time, distances[i]));
  return races.reduce((acc, race) => acc * race.countWinCasesRawMs(), 1);
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const [time, distance] = getLines(input)
    .filter(Boolean)
    .map((line) =>
      Number(line.trim().split(":")[1].trim().replaceAll(/\s+/g, ""))
    );
  const race = new Race(time, distance);
  return race.quadraticFormulaSolution();
}
