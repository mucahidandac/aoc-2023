
import { part1, part2 } from "./day-13";

describe("day-13", () => {
  it("part 1", () => {
    expect(part1("./day-13-part-01.example.txt")).toBe(405);
    expect(part1("./day-13.txt")).toBe(30535);
  });
  it("part 2", () => {
    expect(part2("./day-13-part-02.example.txt")).toBe(400);
    expect(part2("./day-13.txt")).toBe(30844);
  });
});
