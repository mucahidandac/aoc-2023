
import { part1, part2 } from "./day-07";

describe("day-07", () => {
  it("part 1", () => {
    expect(part1("./day-07-part-01.example.txt")).toBe(6440);
    expect(part1("./day-07.txt")).toBe(246912307);
  });
  it("part 2", () => {
    expect(part2("./day-07-part-02.example.txt")).toBe(5905);
    expect(part2("./day-07.txt")).toBe(246894760);
  });
});
