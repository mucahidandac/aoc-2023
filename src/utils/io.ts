import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export function getInput(dir: string, file: string) {
  return readFileSync(resolve(dir, file), {
    encoding: "utf-8",
  });
}

export function getLines(file: string): string[] {
  return file.trim().split(/\r?\n/);
}
