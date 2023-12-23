
import { part1, part2 } from "./day-25";

describe("day-25", () => {
  it("part 1", () => {
    expect(part1("./day-25-part-01.example.txt")).toBe(1);
    expect(part1("./day-25.txt")).toBe(1);
  });
  it("part 2", () => {
    expect(part2("./day-25-part-02.example.txt")).toBe(1);
    expect(part2("./day-25.txt")).toBe(1);
  });
});
