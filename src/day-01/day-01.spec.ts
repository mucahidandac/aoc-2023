import { part1, part2 } from "./day-01";

describe("day-01", () => {
  it("part 1", () => {
    expect(part1("./day-01-part-01.example.txt")).toBe(142);
    expect(part1("./day-01.txt")).toBe(54940);
  });
  it("part 2", () => {
    expect(part2("./day-01-part-02.example.txt")).toBe(281);
    expect(part2("./day-01.txt")).toBe(54208);
  });
});
