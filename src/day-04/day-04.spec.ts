
import { part1, part2 } from "./day-04";

describe("day-04", () => {
  it("part 1", () => {
    expect(part1("./day-04-part-01.example.txt")).toBe(13);
    expect(part1("./day-04.txt")).toBe(19855);
  });
  it("part 2", () => {
    expect(part2("./day-04-part-02.example.txt")).toBe(30);
    expect(part2("./day-04.txt")).toBe(10378710);
  });
});
