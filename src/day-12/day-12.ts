import memoize from "lodash/memoize";
import { getInput, getLines } from "../utils/io";

type Char = "#" | "." | "?";
const GOOD: Char = ".";
const DAMAGED: Char = "#";
const UNKNOWN: Char = "?";

const memoizedSolver = memoize(
  (springString: string, damagedSegments: number[]): number => {
    if (springString.length === 0) {
      return damagedSegments.length > 0 ? 0 : 1;
    }

    let nextChar = springString[0];
    if (nextChar === GOOD) {
      let chars = 0;
      while (nextChar === GOOD) {
        nextChar = springString[++chars];
      }
      return memoizedSolver(springString.slice(chars), damagedSegments);
    } else if (nextChar === DAMAGED) {
      if (damagedSegments.length < 1) {
        return 0;
      }
      const [currentSegment, ...remainingSegments] = damagedSegments;
      for (let i = 0; i < currentSegment; i++) {
        if (springString[i] == null || springString[i] === GOOD) {
          return 0;
        } else if (springString[currentSegment] === DAMAGED) {
          return 0;
        }
      }
      return memoizedSolver(
        springString.slice(currentSegment + 1),
        remainingSegments
      );
    } else {
      return (
        memoizedSolver(DAMAGED + springString.slice(1), damagedSegments) +
        memoizedSolver(GOOD + springString.slice(1), damagedSegments)
      );
    }
  },
  (...args: any[]) => {
    return JSON.stringify(args);
  }
);

class Spring {
  constructor(
    private readonly springs: string,
    private readonly brokenCounts: number[]
  ) {}

  getArrangementCount(): number {
    const count = memoizedSolver(this.springs, this.brokenCounts);
    return count;
  }
}

class GearFactory {
  private readonly springs: Spring[];

  constructor(lines: string[], part2 = false) {
    this.springs = lines.map((line) => {
      const [springPart, brokenSpringPart] = line.trim().split(" ");
      let formattedSprings = springPart;
      let springNumbers = brokenSpringPart.split(",").map(Number);
      if (part2) {
        formattedSprings = new Array(5).fill(springPart).join("?");
        springNumbers = new Array(5).fill(springNumbers).flat();
      }
      return new Spring(formattedSprings, springNumbers);
    });
  }

  calculateArrangementCount(): number {
    let total = 0;
    for (const spring of this.springs) {
      total += spring.getArrangementCount();
    }
    return total;
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const gearFactory = new GearFactory(getLines(input));
  return gearFactory.calculateArrangementCount();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const gearFactory = new GearFactory(getLines(input), true);
  return gearFactory.calculateArrangementCount();
}
