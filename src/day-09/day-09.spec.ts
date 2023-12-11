
import { part1, part2 } from "./day-09";

describe("day-09", () => {
  it("part 1", () => {
    expect(part1("./day-09-part-01.example.txt")).toBe(114);
    expect(part1("./day-09.txt")).toBe(2101499000);
  });
  it("part 2", () => {
    expect(part2("./day-09-part-02.example.txt")).toBe(2);
    expect(part2("./day-09.txt")).toBe(1089);
  });
});
