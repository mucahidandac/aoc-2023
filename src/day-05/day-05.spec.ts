
import { part1, part2 } from "./day-05";

describe("day-05", () => {
  it("part 1", () => {
    expect(part1("./day-05-part-01.example.txt")).toBe(35);
    expect(part1("./day-05.txt")).toBe(806029445);
  });
  it("part 2", () => {
    expect(part2("./day-05-part-02.example.txt")).toBe(46);
    expect(part2("./day-05.txt")).toBe(59370572);
  });
});
