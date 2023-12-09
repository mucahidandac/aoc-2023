import { getInput, getLines } from "../utils/io";

function isTerminalState(numbers: number[]): boolean {
  return numbers.reduce((a, b) => a + b, 0) === 0;
}

class Line {
  private numbers: number[][];
  constructor(line: string) {
    const firstLine = line.split(/\s+/g).map((n) => parseInt(n, 10));

    let terminalState = isTerminalState(firstLine);

    this.numbers = [firstLine];
    let depth = 0;

    if (!terminalState) {
      this.numbers.push([]);
      depth++;
    }

    while (!terminalState) {
      const previousLine = this.numbers[depth - 1];
      const newLine = this.numbers[depth];
      for (let i = 0; i < previousLine.length - 1; i++) {
        newLine.push(previousLine[i + 1] - previousLine[i]);
      }
      console.assert(
        newLine.length === previousLine.length - 1,
        "new line is not smaller than previous line"
      );
      terminalState = isTerminalState(newLine);
      if (!terminalState) {
        this.numbers.push([]);
        depth++;
      }
    }
    console.assert(
      this.numbers[this.numbers.length - 1].reduce((a, b) => a + b, 0) === 0,
      "last line is not terminal"
    );
  }

  findAppendedNextNumber(): number {
    this.numbers[this.numbers.length - 1].push(0);
    for (let i = this.numbers.length - 1; i > 0; i--) {
      const bottomLine = this.numbers[i];
      const topLine = this.numbers[i - 1];
      const newNumber =
        bottomLine[bottomLine.length - 1] + topLine[topLine.length - 1];
      topLine.push(newNumber);
    }
    return this.numbers[0][this.numbers[0].length - 1];
  }

  findPrependedNextNumber(): number {
    this.numbers[this.numbers.length - 1].unshift(0);
    for (let i = this.numbers.length - 1; i > 0; i--) {
      const bottomLine = this.numbers[i];
      const topLine = this.numbers[i - 1];
      const newNumber = topLine[0] - bottomLine[0];
      topLine.unshift(newNumber);
    }
    return this.numbers[0][0];
  }
}

class SandMachine {
  lines: Line[];
  constructor(lines: string[]) {
    this.lines = lines.map((line) => new Line(line.trim()));
  }

  sumAppendedNextNumbers(): number {
    let count = 0;
    for (let i = 0; i < this.lines.length; i++) {
      count += this.lines[i].findAppendedNextNumber();
    }
    return count;
  }
  sumPrependedNextNumbers(): number {
    let count = 0;
    for (let i = 0; i < this.lines.length; i++) {
      count += this.lines[i].findPrependedNextNumber();
    }
    return count;
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const sandMachine = new SandMachine(getLines(input));
  return sandMachine.sumAppendedNextNumbers();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const sandMachine = new SandMachine(getLines(input));
  return sandMachine.sumPrependedNextNumbers();
}
