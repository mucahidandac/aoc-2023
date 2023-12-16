
import { part1, part2 } from "./day-16";

describe("day-16", () => {
  it("part 1", () => {
    expect(part1("./day-16-part-01.example.txt")).toBe(46);
    expect(part1("./day-16.txt")).toBe(7860);
  });
  it("part 2", () => {
    expect(part2("./day-16-part-02.example.txt")).toBe(51);
    expect(part2("./day-16.txt")).toBe(8331);
  });
});
