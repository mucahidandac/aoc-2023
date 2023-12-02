
import { getInput, getLines } from "../utils/io";

const NUMBERS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  zero: 0,
} as const;

type Keys = keyof typeof NUMBERS;

const getDigit = (numOrWord: string): number => {
  const num = parseInt(numOrWord, 10);

  if (!Number.isNaN(num)) return num;

  return NUMBERS[numOrWord as Keys];
};

const reverseString = (str: string) => str.split("").toReversed().join("");

function getDigitSecond(line: string): number {
  const [first] = line.match(
    /[1-9]|one|two|three|four|five|six|seven|eight|nine/
  ) || [""];
  const [second] = reverseString(line).match(
    /[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez/
  ) || [""];
  return Number(`${getDigit(first)}${getDigit(reverseString(second))}`);
}

function getDigitsFirst(line: string): number {
  const [first] = line.match(
    /[1-9]/
  ) || [""];
  const [second] = reverseString(line).match(
    /[0-9]/
  ) || [""];
  return Number(`${getDigit(first)}${getDigit(second)}`);
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  let total = 0;
  for (const line of lines) {
    total += getDigitsFirst(line);
  }
  return total;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  let total = 0;
  for (const line of lines) {
    total += getDigitSecond(line);
  }
  return total;
}
