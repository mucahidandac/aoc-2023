
import { part1, part2 } from "./day-23";

describe("day-23", () => {
  it("part 1", () => {
    expect(part1("./day-23-part-01.example.txt")).toBe(1);
    expect(part1("./day-23.txt")).toBe(1);
  });
  it("part 2", () => {
    expect(part2("./day-23-part-02.example.txt")).toBe(1);
    expect(part2("./day-23.txt")).toBe(1);
  });
});
