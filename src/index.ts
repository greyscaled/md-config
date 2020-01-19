#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const mdConfig = {
  default: true,
  MD013: {
    code_blocks: false,
    headings: false,
    line_length: 80,
    tables: false,
  },
}

const lintScript = {
  "lint:md": "markdownlint --ignore \"**/node_modules/**\" ."
}

const vsCodeSettings = {
  "markdownlint.config": mdConfig,
  "markdownlint.ignore": [
    "node_modules/"
  ],
}

function writeData(file: string, json: any) {
  writeFileSync(file, JSON.stringify(json, null, 2));
}

function main(): void {
  const mdlintPath = resolve(process.cwd(), '.markdownlint.json');
  const pkgPath = resolve(process.cwd(), 'package.json');
  const vsCodeDir = resolve(process.cwd(), '.vscode');
  const vsCodeSettingsPath = resolve(vsCodeDir, 'settings.json');

  // writes .markdownlint.json in cwd
  writeData(mdlintPath, mdConfig);

  // writes .vscode/settings.json in cwd
  if (!existsSync(vsCodeDir)) {
    mkdirSync(vsCodeDir);
  }

  if (!existsSync(vsCodeSettingsPath)) {
    writeData(vsCodeSettingsPath, vsCodeSettings);
  } else {
    const vsOutput = JSON.parse(readFileSync(vsCodeSettingsPath, 'utf8'));
    writeData(vsCodeSettingsPath, { ...vsOutput, ...vsCodeSettings });
  }

  // writes package.json lint script in cwd
  execSync('npm install --save-dev markdownlint-cli')
  const pkgOutput = JSON.parse(readFileSync(pkgPath, 'utf8'));
  writeData(pkgPath, {
    ...pkgOutput,
    scripts: {
      ...pkgOutput.scripts,
      ...lintScript
    }
  })
}

main()
