
import { part1, part2 } from "./day-10";

describe("day-10", () => {
  it("part 1", () => {
    expect(part1("./day-10-part-01.example.txt")).toBe(4);
    expect(part1("./day-10-part-01.example2.txt")).toBe(8);
    expect(part1("./day-10.txt")).toBe(7086);
  });
  it("part 2", () => {
    expect(part2("./day-10-part-02.example.txt")).toBe(4);
    expect(part2("./day-10-part-02.example2.txt")).toBe(1);
    expect(part2("./day-10.txt")).toBe(317);
  });
});
