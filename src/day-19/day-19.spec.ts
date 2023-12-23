
import { part1, part2 } from "./day-19";

describe("day-19", () => {
  it("part 1", () => {
    expect(part1("./day-19-part-01.example.txt")).toBe(19114);
    expect(part1("./day-19.txt")).toBe(389114);
  });
  it("part 2", () => {
    expect(part2("./day-19-part-02.example.txt")).toBe(167409079868000);
    expect(part2("./day-19.txt")).toBe(125051049836302);
  });
});
