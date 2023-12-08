
import { part1, part2 } from "./day-08";

describe("day-08", () => {
  it("part 1", () => {
    expect(part1("./day-08-part-01.example.txt")).toBe(2);
    expect(part1("./day-08.txt")).toBe(12169);
  });
  it("part 2", () => {
    expect(part2("./day-08-part-02.example.txt")).toBe(6);
    expect(part2("./day-08.txt")).toBe(12030780859469);
  });
});
