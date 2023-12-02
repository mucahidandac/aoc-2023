import chalk from "chalk";
import fs, { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dayNumber = process.argv[2];

if (!dayNumber) {
  console.error(
    chalk.red(
      "Please provide a day number. Usage: node ./scripts/generate.js <day-number>"
    )
  );
  process.exit(1);
}

const folderName = `day-${dayNumber}`;
const folderPath = path.join(__dirname, `../src/${folderName}`);

if (fs.existsSync(folderPath)) {
  console.error(chalk.red(`Folder [${folderPath}] exists \n`));
  process.exit(1);
}
// Create the folder
fs.mkdirSync(folderPath);

// Create files inside the folder
const dayTsContent = `import { getInput, getLines } from "../utils/io";

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  return lines.length;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const lines = getLines(input);
  return lines.length;
}
`;

const daySpecTsContent = `
import { part1, part2 } from "./${folderName}";

describe("${folderName}", () => {
  it("part 1", () => {
    expect(part1("./${folderName}-part-01.example.txt")).toBe(1);
    expect(part1("./${folderName}.txt")).toBe(1);
  });
  it("part 2", () => {
    expect(part2("./${folderName}-part-02.example.txt")).toBe(1);
    expect(part2("./${folderName}.txt")).toBe(1);
  });
});
`;

fs.writeFileSync(path.join(folderPath, `${folderName}.ts`), dayTsContent);
fs.writeFileSync(
  path.join(folderPath, `${folderName}.spec.ts`),
  daySpecTsContent
);
fs.writeFileSync(
  path.join(folderPath, `${folderName}-part-02.example.txt`),
  ""
);
fs.writeFileSync(
  path.join(folderPath, `${folderName}-part-01.example.txt`),
  ""
);
fs.writeFileSync(path.join(folderPath, `${folderName}.txt`), "");

console.log(
  chalk.green(`Folder structure and files generated at: [${folderPath}]`)
);
