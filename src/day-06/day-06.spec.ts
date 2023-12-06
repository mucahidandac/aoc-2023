
import { part1, part2 } from "./day-06";

describe("day-06", () => {
  it("part 1", () => {
    expect(part1("./day-06-part-01.example.txt")).toBe(288);
    expect(part1("./day-06.txt")).toBe(449820);
  });
  it("part 2", () => {
    expect(part2("./day-06-part-02.example.txt")).toBe(71503);
    expect(part2("./day-06.txt")).toBe(42250895);
  });
});
