
import { part1, part2 } from "./day-14";

describe("day-14", () => {
  it("part 1", () => {
    expect(part1("./day-14-part-01.example.txt")).toBe(136);
    expect(part1("./day-14.txt")).toBe(110821);
  });
  it("part 2", () => {
    expect(part2("./day-14-part-02.example.txt")).toBe(64);
    expect(part2("./day-14.txt")).toBe(83516);
  });
});
