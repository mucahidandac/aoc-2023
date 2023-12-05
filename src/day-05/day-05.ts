import { getInput, getLines } from "../utils/io";

type AlmanacMapKey =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

type Key =
  | "seed"
  | "location"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity";

type AlmanacMap = {
  [key in AlmanacMapKey]: AlmanacMapItem;
};
type AlmanacRange = {
  from: number;
  to: number;
  difference: number;
};
type AlmanacMapItem = Array<AlmanacRange>;

type SeedRange = {
  src: number;
  dest: number;
  range: number;
};

type PartTwoMapItem = { from: Key; to: Key; map: SeedRange[] };
type PartTwoMap = Record<Key, PartTwoMapItem>;

class AlmanacMapper {
  private maps: AlmanacMap;
  constructor() {
    this.maps = {
      "seed-to-soil": [],
      "soil-to-fertilizer": [],
      "fertilizer-to-water": [],
      "water-to-light": [],
      "light-to-temperature": [],
      "temperature-to-humidity": [],
      "humidity-to-location": [],
    };
  }

  updateMap(key: AlmanacMapKey, item: AlmanacMapItem) {
    this.maps[key] = item;
  }

  private processMap(key: AlmanacMapKey, value: number): number {
    const found = this.maps[key].find(
      (item) => item.from <= value && value <= item.to
    );
    return found ? found.difference + value : value;
  }

  findLocation(seed: number) {
    const soil = this.processMap("seed-to-soil", seed);
    const fertilizer = this.processMap("soil-to-fertilizer", soil);
    const water = this.processMap("fertilizer-to-water", fertilizer);
    const light = this.processMap("water-to-light", water);
    const temp = this.processMap("light-to-temperature", light);
    const humidity = this.processMap("temperature-to-humidity", temp);
    const location = this.processMap("humidity-to-location", humidity);
    return location;
  }
}

class Almanac {
  seeds: number[];
  mapper: AlmanacMapper;
  constructor() {
    this.seeds = [];
    this.mapper = new AlmanacMapper();
  }

  prepareSeeds(line: string) {
    this.seeds = line.trim().split(":")[1].trim().split(/\s+/g).map(Number);
  }

  prepareMap(lines: string[]) {
    let mapInputs: [number, number, number][] = [];
    let mapKey: AlmanacMapKey = "seed-to-soil";
    for (let i = -1; i < lines.length; i++) {
      const line = lines[i + 1];
      if (!line) {
        // spacer
        const newMapItem: AlmanacMapItem = [];
        mapInputs.forEach(([destination, source, length]) => {
          newMapItem.push({
            from: source,
            to: source + length - 1,
            difference: destination - source,
          });
        });
        this.mapper.updateMap(mapKey, newMapItem);
        mapInputs = [];
      } else if (Number.isNaN(Number(line.charAt(0)))) {
        // map key
        mapKey = line.trim().split(" ")[0] as AlmanacMapKey;
      } else {
        // map input
        mapInputs.push(
          line.trim().split(/\s+/g).map(Number) as [number, number, number]
        );
      }
    }
  }

  findLowestLocation() {
    return Math.min(
      ...this.seeds.map((seed) => this.mapper.findLocation(seed))
    );
  }
}

let highestValuePossible = 0;

function createRange(line: string) {
  const items = line.split(" ");
  const range = {
    dest: +items[0],
    src: +items[1],
    range: +items[2],
  };

  highestValuePossible = Math.max(
    highestValuePossible,
    range.src + range.range,
    range.dest + range.range
  );

  return range;
}

function parseMap(data: string) {
  const contents = data.split("\n").filter(Boolean);
  const [from, _, to] = contents.shift()!.split(" ")[0].split("-");

  return {
    from: from as Key,
    to: to as Key,
    map: contents.map(createRange),
  };
}

function walk(value: number, range: number, name: Key, map: PartTwoMap) {
  if (map[name] === undefined) {
    return [value, range];
  }

  const item = map[name];
  const rangeItem = item.map.find(
    (x) => x.src <= value && value < x.src + x.range
  );
  if (rangeItem) {
    const diff = value - rangeItem.src;
    const newValue = rangeItem.dest + diff;
    return walk(
      newValue,
      Math.min(range, rangeItem.range - diff),
      item.to,
      map
    );
  }

  return walk(value, 1, item.to, map);
}

function createNegativeRanges(ranges: SeedRange[]) {
  ranges.sort((a, b) => a.src - b.src);

  let start = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (range.src > start) {
      ranges.splice(i, 0, {
        src: start,
        dest: start,
        range: range.src - start,
      });
      i++;
    }
    start = range.src + range.range;
  }
  return ranges;
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  const [seedLine, _spacer, ...rest] = lines;
  const almanac = new Almanac();
  almanac.prepareSeeds(seedLine);
  almanac.prepareMap(rest);
  return almanac.findLowestLocation();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = input.split("\n\n").filter((x) => x.length);
  const seedValues = lines.shift()!.split(": ")[1].split(" ");
  const seeds = [];
  for (let i = 0; i < seedValues.length; i += 2) {
    seeds.push({
      start: +seedValues[i],
      length: +seedValues[i + 1],
    });
  }
  const parsedMap = lines
    .map((i) => {
      const p = parseMap(i);
      p.map = createNegativeRanges(p.map);
      return p;
    })
    .reduce((acc, x) => {
      acc[x.from] = x;
      return acc;
    }, {} as PartTwoMap);
  let lowest = Infinity;
  for (const seed of seeds) {
    let remaining = seed.length;
    let start = seed.start;
    while (remaining > 0) {
      const [startLocation, consumed] = walk(
        start,
        remaining,
        "seed",
        parsedMap
      );

      remaining -= consumed;
      start += consumed;
      if (startLocation < lowest) {
        lowest = startLocation;
      }
    }
  }
  return lowest;
}
