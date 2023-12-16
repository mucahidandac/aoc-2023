import memoize from "lodash/memoize";
import { getInput } from "../utils/io";

type Lens = {
  label: string;
  num: number;
};

function hashFunction(input: string): number {
  let acc = 0;

  for (let i = 0; i < input.length; i++) {
    acc += input.charCodeAt(i);
    acc *= 17;
    acc %= 256;
  }
  return acc;
}

const hashMemoized = memoize(hashFunction);

function focalLengthMap(lines: string[]): Map<number, Lens[]> {
  const map = new Map<number, Lens[]>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isEqualSign = line.includes("=");
    const [label, num] = isEqualSign ? line.split("=") : line.split("-");
    const hash = hashMemoized(label);
    if (isEqualSign) {
      // equals operator
      if (!map.has(hash)) {
        map.set(hash, []);
      }
      const bucket = map.get(hash)!;
      const foundIndex = bucket.findIndex((lens) => lens.label === label);
      if (foundIndex === -1) {
        bucket.push({ label, num: Number(num) });
      } else {
        bucket[foundIndex].num = Number(num);
      }
    } else {
      // dash operator
      if (!map.has(hash)) {
        continue;
      }

      const bucket = map.get(hash)!;
      const foundIndex = bucket.findIndex((lens) => lens.label === label);
      if (foundIndex === -1) {
        continue;
      }
      bucket.splice(foundIndex, 1);
    }
  }
  return map;
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = input.split(",");
  const hashes = lines.map(hashMemoized);
  let count = 0;
  for (let i = 0; i < hashes.length; i++) {
    count += hashes[i];
  }
  return count;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = input.split(",");
  const focalLengths = focalLengthMap(lines);
  let total = 0;
  for (const [hash, lenses] of focalLengths) {
    total += lenses.reduce(
      (acc, lens, idx) => acc + (hash + 1) * (idx + 1) * lens.num,
      0
    );
  }
  return total;
}
