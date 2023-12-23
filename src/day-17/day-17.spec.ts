
import { part1, part2 } from "./day-17";

describe("day-17", () => {
  it("part 1", () => {
    expect(part1("./day-17-part-01.example.txt")).toBe(100);
    expect(part1("./day-17.txt")).toBe(635);
  });
  it("part 2", () => {
    expect(part2("./day-17-part-02.example.txt")).toBe(92);
    expect(part2("./day-17.txt")).toBe(734);
  });
});
