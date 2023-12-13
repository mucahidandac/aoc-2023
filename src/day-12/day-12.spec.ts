
import { part1, part2 } from "./day-12";

describe("day-12", () => {
  it("part 1", () => {
    expect(part1("./day-12-part-01.example.txt")).toBe(21);
    expect(part1("./day-12.txt")).toBe(7674);
  });
  it("part 2", () => {
    expect(part2("./day-12-part-02.example.txt")).toBe(525152);
    expect(part2("./day-12.txt")).toBe(4443895258186);
  });
});
