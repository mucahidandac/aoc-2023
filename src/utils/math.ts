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

export function quadraticFormulaRoots(a: number, b: number, c: number) {
  // ax^2 + bx + c = 0 is a Quadratic equation where
  const discriminant = Math.abs(b * b - 4 * c * a);
  const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [r1, r2];
}
