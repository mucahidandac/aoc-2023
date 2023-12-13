import { getInput, getLines } from "../utils/io";

class Area {
  rows: string[];
  cols: string[];
  constructor(input: string[]) {
    this.cols = new Array(input[0].length).fill("");
    this.rows = input.map((row) => {
      row.split("").forEach((char, colIndex) => {
        this.cols[colIndex] += char;
      });
      return row;
    });
  }
  countDifferences(arr: string[], arr2: string[]) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== arr2[i]) {
        count++;
      }
    }
    return count;
  }

  scanWithSmudge(arr: string[], multiplier = 1) {
    for (let i = 1; i < arr.length; i++) {
      let errorCount = 0;
      if (this.countDifferences(arr[i].split(""), arr[i - 1].split("")) <= 1) {
        for (let l = i - 1, r = i; l >= 0 && r < arr.length; l--, r++) {
          errorCount += this.countDifferences(
            arr[l].split(""),
            arr[r].split("")
          );
        }
        if (errorCount === 1) {
          return i * multiplier;
        }
      }
    }
    return 0;
  }
  scan(arr: string[], multiplier = 1) {
    for (let i = 1; i < arr.length; i++) {
      let found = true;
      if (arr[i] === arr[i - 1]) {
        for (let l = i - 1, r = i; l >= 0 && r < arr.length; l--, r++) {
          if (arr[l] !== arr[r]) {
            found = false;
          }
        }
        if (found) {
          return i * multiplier;
        }
      }
    }
    return 0;
  }

  scanRow(withSmudge = false) {
    return withSmudge
      ? this.scanWithSmudge(this.rows, 100)
      : this.scan(this.rows, 100);
  }

  scanCol(withSmudge = false) {
    return withSmudge
      ? this.scanWithSmudge(this.cols, 1)
      : this.scan(this.cols, 1);
  }
}

class Volcano {
  areas: Area[];
  constructor(input: string) {
    this.areas = input.split("\n\n").map((line) => new Area(getLines(line)));
  }

  solvePart1(): number {
    let total = 0;
    for (let i = 0; i < this.areas.length; i++) {
      const area = this.areas[i];
      const scan = area.scanRow() || area.scanCol();
      total += scan;
    }
    return total;
  }
  solvePart2(): number {
    let total = 0;
    for (let i = 0; i < this.areas.length; i++) {
      const area = this.areas[i];
      const scan = area.scanRow(true) || area.scanCol(true);
      total += scan;
    }
    return total;
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const volcano = new Volcano(input);
  return volcano.solvePart1();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const volcano = new Volcano(input);
  return volcano.solvePart2();
}
