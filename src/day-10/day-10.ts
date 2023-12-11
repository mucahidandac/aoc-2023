import { getInput, getLines } from "../utils/io";

const symbolMap = {
  F: "\u250F",
  J: "\u251B",
  L: "\u2517",
  "7": "\u2513",
  "|": "\u2503",
  "-": "\u2501",
} as const;

type PipeSymbolKey = keyof typeof symbolMap;
type PipeSymbols = (typeof symbolMap)[PipeSymbolKey];
type Coords = {
  col: number;
  row: number;
};

type Pipe = Coords & {
  symbol: PipeSymbolKey;
  connections: Coords[];
  isStart?: boolean;
  visited?: boolean;
  distance?: number;
  outside?: boolean;
};

type PipeMap = Pipe[][];

class PipeMaze {
  board: Pipe[][];
  start: Coords | undefined;
  searchPath1: Pipe[];
  searchPath2: Pipe[];
  constructor(lines: string[]) {
    this.board = [];
    this.start = undefined;
    this.searchPath1 = [];
    this.searchPath2 = [];
    this.initializeStart(lines);
  }
  initializeStart(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      let cells = lines[i].split("");
      this.board.push([]);
      for (let j = 0; j < cells.length; j++) {
        this.board[i].push({
          col: j,
          row: i,
          symbol: cells[j] as PipeSymbolKey,
          connections: [],
        });
        if (cells[j] == "|") {
          this.board[i][j].connections = [
            { row: i - 1, col: j },
            { row: i + 1, col: j },
          ];
        } else if (cells[j] == "-") {
          this.board[i][j].connections = [
            { row: i, col: j - 1 },
            { row: i, col: j + 1 },
          ];
        } else if (cells[j] == "7") {
          this.board[i][j].connections = [
            { row: i, col: j - 1 },
            { row: i + 1, col: j },
          ];
        } else if (cells[j] == "J") {
          this.board[i][j].connections = [
            { row: i, col: j - 1 },
            { row: i - 1, col: j },
          ];
        } else if (cells[j] == "L") {
          this.board[i][j].connections = [
            { row: i, col: j + 1 },
            { row: i - 1, col: j },
          ];
        } else if (cells[j] == "F") {
          this.board[i][j].connections = [
            { row: i, col: j + 1 },
            { row: i + 1, col: j },
          ];
        } else if (cells[j] == "S") {
          this.start = { col: j, row: i };
          this.board[i][j].isStart = true;
        }
      }
    }
    if (!this.start) {
      throw new Error("No start found");
    }
  }

  findLoop() {
    if (!this.start) {
      throw new Error("No start found");
    }
    this.board[this.start.row][this.start.col].visited = true;
    this.board[this.start.row][this.start.col].distance = 0;
    let top: Pipe | undefined =
      this.start.row > 0
        ? this.board[this.start.row - 1][this.start.col]
        : undefined;
    let bottom: Pipe | undefined =
      this.start.row < this.board.length - 1
        ? this.board[this.start.row + 1][this.start.col]
        : undefined;
    let left: Pipe | undefined =
      this.start.col > 0
        ? this.board[this.start.row][this.start.col - 1]
        : undefined;
    let right: Pipe | undefined =
      this.start.col < this.board[0].length - 1
        ? this.board[this.start.row][this.start.col + 1]
        : undefined;

    let topConnection = !!top && ["|", "7", "F"].includes(top.symbol);
    let bottomConnection = !!bottom && ["|", "J", "L"].includes(bottom.symbol);
    let leftConnection = !!left && ["-", "F", "L"].includes(left.symbol);
    let rightConnection = !!right && ["-", "7", "J"].includes(right.symbol);

    if (topConnection && bottomConnection) {
      this.board[this.start.row][this.start.col].symbol = "|";
      this.board[this.start.row][this.start.col].connections = [
        { row: this.start.row - 1, col: this.start.col },
        { row: this.start.row + 1, col: this.start.col },
      ];
      this.searchPath1.push(top!);
      this.searchPath2.push(bottom!);
    } else if (leftConnection && rightConnection) {
      this.board[this.start.row][this.start.col].symbol = "-";
      this.board[this.start.row][this.start.col].connections = [
        { row: this.start.row, col: this.start.col - 1 },
        { row: this.start.row, col: this.start.col + 1 },
      ];
      this.searchPath1.push(left!);
      this.searchPath2.push(right!);
    } else if (leftConnection && bottomConnection) {
      this.board[this.start.row][this.start.col].symbol = "J";
      this.board[this.start.row][this.start.col].connections = [
        { row: this.start.row, col: this.start.col - 1 },
        { row: this.start.row - 1, col: this.start.col },
      ];
      this.searchPath1.push(left!);
      this.searchPath2.push(top!);
    } else if (rightConnection && topConnection) {
      this.board[this.start.row][this.start.col].symbol = "L";
      this.board[this.start.row][this.start.col].connections = [
        { row: this.start.row, col: this.start.col + 1 },
        { row: this.start.row - 1, col: this.start.col },
      ];
      this.searchPath1.push(right!);
      this.searchPath2.push(top!);
    } else if (rightConnection && bottomConnection) {
      this.board[this.start.row][this.start.col].symbol = "F";
      this.board[this.start.row][this.start.col].connections = [
        { row: this.start.row, col: this.start.col + 1 },
        { row: this.start.row + 1, col: this.start.col },
      ];
      this.searchPath1.push(right!);
      this.searchPath2.push(bottom!);
    }
  }
  getNextNode(node: Pipe) {
    let nextNode: Pipe | undefined = undefined;
    for (let i = 0; i < node.connections.length; i++) {
      let connection = node.connections[i];
      if (this.board[connection.row][connection.col].visited) {
        continue;
      }

      nextNode = this.board[connection.row][connection.col];
      break;
    }
    if (nextNode == undefined) {
      throw new Error("No next node found");
    }

    return nextNode;
  }

  getDistanceToStart() {
    let moreNodesToVisit = true;
    let distance = 0;
    let node1: Pipe | undefined = undefined;
    let node2: Pipe | undefined = undefined;

    while (moreNodesToVisit) {
      distance++;
      node1 = this.searchPath1[this.searchPath1.length - 1];
      node2 = this.searchPath2[this.searchPath2.length - 1];

      if (node1 == undefined || node2 == undefined) {
        moreNodesToVisit = false;
        break;
      }

      node1.visited = true;
      node1.distance = distance;

      node2.visited = true;
      node2.distance = distance;

      if (node1.row == node2.row && node1.col == node2.col) {
        moreNodesToVisit = false;
        break;
      } else {
        this.searchPath1.push(this.getNextNode(node1));
        this.searchPath2.push(this.getNextNode(node2));
      }
    }
    return distance;
  }

  findInsideOutside() {
    // Left to right
    for (let i = 0; i < this.board.length; i++) {
      let pipeCount = 0;
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          this.board[i][j].distance != undefined &&
          this.board[i][j].symbol == "|" &&
          this.board[i][j].symbol != "J" &&
          this.board[i][j].symbol != "L"
        ) {
          pipeCount++;
        } else if (
          this.board[i][j].distance != undefined &&
          this.board[i][j].symbol != "-" &&
          this.board[i][j].symbol != "7" &&
          this.board[i][j].symbol != "F"
        ) {
          pipeCount--;
        } else {
          if (pipeCount % 2 == 0) {
            this.board[i][j].outside = true;
          }
        }
      }
    }

    // Right to left
    for (let i = 0; i < this.board.length; i++) {
      let pipeCount = 0;
      for (let j = this.board[i].length - 1; j >= 0; j--) {
        if (
          this.board[i][j].distance != undefined &&
          this.board[i][j].symbol == "|" &&
          this.board[i][j].symbol != "J" &&
          this.board[i][j].symbol != "L"
        ) {
          pipeCount++;
        } else if (
          this.board[i][j].distance != undefined &&
          this.board[i][j].symbol != "-" &&
          this.board[i][j].symbol != "7" &&
          this.board[i][j].symbol != "F"
        ) {
          pipeCount--;
        } else {
          if (pipeCount % 2 == 0) {
            this.board[i][j].outside = true;
          }
        }
      }
    }

    let insideCount = 0;
    // Part 2
    for (let i = 0; i < this.board.length; i++) {
      // console.log();
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j].distance != undefined) {
          // process.stdout.write(`${symbolMap[this.board[i][j].symbol]}`);
        } else if (!this.board[i][j].outside) {
          // process.stdout.write("*");
          insideCount++;
        } else {
          // process.stdout.write(" ");
        }
      }
    }
    return insideCount;
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const maze = new PipeMaze(getLines(input));
  maze.findLoop();
  return maze.getDistanceToStart();
}

export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const maze = new PipeMaze(getLines(input));
  maze.findLoop();
  maze.getDistanceToStart();
  return maze.findInsideOutside();
}
