
import { part1, part2 } from "./day-18";

describe("day-18", () => {
  it("part 1", () => {
    expect(part1("./day-18-part-01.example.txt")).toBe(62);
    expect(part1("./day-18.txt")).toBe(72821);
  });
  it("part 2", () => {
    expect(part2("./day-18-part-02.example.txt")).toBe(952408144115);
    expect(part2("./day-18.txt")).toBe(127844509405501);
  });
});
