#!/usr/bin/env node

import { execSync } from "child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const lintScript = {
  "lint:md": 'markdownlint --ignore "**/node_modules/**" .'
};

function writeData(file: string, json: any) {
  writeFileSync(file, JSON.stringify(json, null, 2));
}

function main(): void {
  if (existsSync(resolve(process.cwd(), "yarn.lock"))) {
    console.info("Running yarn add -D markdownlint-cli");
    execSync("yarn add -D markdownlint-cli");
  } else if (existsSync(resolve(process.cwd(), "package-lock.json"))) {
    console.info("Running npm install --save-dev markdownlint-cli");
    execSync("npm install --save-dev markdownlint-cli");
  } else {
    console.info(
      "Neither yarn.lock or package-lock detected. Please install markdownlint-cli manually."
    );
  }

  if (existsSync(resolve(process.cwd(), "package.json"))) {
    console.info("Adding lint:md script to package.json");
    const pkgPath = resolve(process.cwd(), "package.json");
    const pkgOutput = JSON.parse(readFileSync(pkgPath, "utf8"));
    writeData(pkgPath, {
      ...pkgOutput,
      scripts: {
        ...pkgOutput.scripts,
        ...lintScript
      }
    });
  }

  console.info("Creating .markdownlint.json");
  const markdownlintJson = ".markdownlint.json";
  const source = resolve(__dirname, "assets", markdownlintJson);
  const dest = resolve(process.cwd(), markdownlintJson);
  copyFileSync(source, dest);
}

main();
