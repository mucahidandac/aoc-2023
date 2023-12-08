import { getInput, getLines } from "../utils/io";
import { lcmArray } from "../utils/math";

type NodePath = "L" | "R";
type Node = string;
type NodeMap = Record<Node, Record<NodePath, Node>>;

function formatInput(lines: string[]) {
  const [commandLine, _, ...directionLines] = lines;
  const commands = commandLine.trim().split("") as NodePath[];
  const directions = directionLines.reduce((acc, directionLine) => {
    const [from, toPart] = directionLine.trim().split(" = ");
    const [toLeft, toRight] = toPart
      .replace("(", "")
      .replace(")", "")
      .split(", ");
    acc[from] = { L: toLeft, R: toRight };
    return acc;
  }, {} as NodeMap);

  return [commands, directions] as const;
}

async function walk(
  nodeMap: NodeMap,
  nodePaths: NodePath[],
  startNode: Node,
  endNode: Node
): Promise<number> {
  let count = 0;
  let currentIndex = 0;
  let currentNode = startNode;
  while (currentNode !== endNode) {
    currentNode = nodeMap[currentNode][nodePaths[currentIndex]];
    currentIndex++;
    if (currentIndex >= nodePaths.length) {
      currentIndex = 0;
    }
    count++;
  }

  return count;
}

class Game {
  nodeMap: NodeMap;
  nodePaths: NodePath[];
  constructor(lines: string[]) {
    const [commands, directions] = formatInput(lines);
    this.nodePaths = commands;
    this.nodeMap = directions;
  }

  walk(startNode: Node, endNode: Node): number {
    let count = 0;
    let currentIndex = 0;
    let currentNode = startNode;
    while (currentNode !== endNode) {
      currentNode = this.nodeMap[currentNode][this.nodePaths[currentIndex]];
      currentIndex++;
      if (currentIndex >= this.nodePaths.length) {
        currentIndex = 0;
      }
      count++;
    }

    return count;
  }

  walk2(): number {
    const startNodes = Object.keys(this.nodeMap).filter((i) => i.endsWith("A"));
    let step = 0;
    const nodePaths = startNodes.reduce((map, n) => {
      map.set(n, []);
      return map;
    }, new Map<string, string[]>());
    for (const startNode of startNodes) {
      let nextNode = startNode;
      while (!nextNode.endsWith("Z")) {
        nextNode =
          this.nodeMap[nextNode][
            this.nodePaths[step++ % this.nodePaths.length]
          ];
        nodePaths.get(startNode)!.push(nextNode);
      }
    }
    const stepCounts = [...nodePaths.values()].map((path) => path.length);
    return lcmArray(stepCounts);
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const game = new Game(getLines(input));
  return game.walk("AAA", "ZZZ");
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const game = new Game(getLines(input));
  return game.walk2();
}
