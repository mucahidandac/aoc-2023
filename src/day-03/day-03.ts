import { getInput, getLines } from "../utils/io";

class CustomNumber {
  constructor(
    public value: number,
    public rowIndex: number,
    public fromColIndex: number,
    public toColIndex: number
  ) {
    this.value = value;
    this.fromColIndex = fromColIndex;
    this.toColIndex = toColIndex;
    this.rowIndex = rowIndex;
  }

  hasSymbolInNeighbourhood(symbol: CustomSymbol) {
    return (
      Math.abs(this.rowIndex - symbol.rowIndex) <= 1 &&
      this.fromColIndex - 1 <= symbol.colIndex &&
      this.toColIndex + 1 >= symbol.colIndex
    );
  }
}

class CustomSymbol {
  constructor(
    public value: string,
    public rowIndex: number,
    public colIndex: number
  ) {}

  numberOfNumberNeighbours(numbers: CustomNumber[]) {
    return numbers.filter((number) => number.hasSymbolInNeighbourhood(this))
      .length;
  }

  isGear(numbers: CustomNumber[]) {
    return this.value === "*" && this.numberOfNumberNeighbours(numbers) === 2;
  }

  getNeighboursProduct(numbers: CustomNumber[]) {
    if (!this.isGear(numbers)) {
      return 0;
    }

    const neighbours = numbers.filter((number) =>
      number.hasSymbolInNeighbourhood(this)
    );

    return neighbours[0].value * neighbours[1].value;
  }
}

function prepare(lines: string[]): Readonly<[CustomNumber[], CustomSymbol[]]> {
  const numbers: CustomNumber[] = [];
  const symbols: CustomSymbol[] = [];
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (!Number.isNaN(Number(line[j]))) {
        let number = line[j];
        while (!Number.isNaN(Number(line[j + 1]))) {
          number += line[j + 1];
          j++;
        }
        numbers.push(
          new CustomNumber(Number(number), i, j - number.length + 1, j)
        );
      } else if (line[j] !== ".") {
        symbols.push(new CustomSymbol(line[j], i, j));
      }
    }
  });
  return [numbers, symbols] as const;
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const [numbers, symbols] = prepare(lines);
  const total = numbers
    .filter((number) =>
      symbols.some((symbol) => number.hasSymbolInNeighbourhood(symbol))
    )
    .reduce((acc, number) => acc + number.value, 0);

  return total;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const [numbers, symbols] = prepare(lines);
  const total = symbols.reduce(
    (acc, symbol) => acc + symbol.getNeighboursProduct(numbers),
    0
  );

  return total;
}
