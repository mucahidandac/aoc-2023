
import { part1, part2 } from "./day-15";

describe("day-15", () => {
  it("part 1", () => {
    expect(part1("./day-15-part-01.example.txt")).toBe(1320);
    expect(part1("./day-15.txt")).toBe(506269);
  });
  it("part 2", () => {
    expect(part2("./day-15-part-02.example.txt")).toBe(145);
    expect(part2("./day-15.txt")).toBe(264021);
  });
});
