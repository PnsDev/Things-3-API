import fs from "fs";
import path from "path";
import * as child from "child_process";

/**
 * Returns the path to nested files inside the folder
 * @param dir The directory to check
 * @param files The array of files to add to
 * @returns The array of files
 */
export function iterateDir(dir: string, files: string[] = []): string[] {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) iterateDir(filePath, files);
    else files.push(filePath);
  });
  return files;
}

/***
 * Returns the path to the parent directory
 * @param dir The directory to go back from
 * @param times The number of times to go back
 * @returns The path to the parent directory
 */
export function goBackDir(dir: string, times: number) {
  for (let i = 0; i < times; i++) {
    dir = path.dirname(dir);
  }
  return dir;
}
