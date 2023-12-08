export function gcd(a: number, b: number) {
  while (b != 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

export function lcm(a: number, b: number) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

export function lcmArray(numbers: number[]): number {
  if (numbers.length === 1) {
    return numbers[0];
  }
  if (numbers.length == 2) {
    return lcm(numbers[0], numbers[1]);
  } else {
    const first = numbers.pop()!;
    return lcm(first, lcmArray(numbers));
  }
}
