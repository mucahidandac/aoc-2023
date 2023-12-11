
import { part1, part2 } from "./day-11";

describe("day-11", () => {
  it("part 1", () => {
    expect(part1("./day-11-part-01.example.txt")).toBe(374);
    expect(part1("./day-11.txt")).toBe(9403026);
  });
  it("part 2", () => {
    expect(part2("./day-11-part-02.example.txt")).toBe(82000210);
    expect(part2("./day-11.txt")).toBe(543018317006);
  });
});
