#!/usr/bin/env node

import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

if (command === "publish") {
  const scriptPath = resolve(__dirname, "../scripts/publish.js");
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
    }
    console.log(stdout);
  });
} else if (command === "init") {
  const scriptPath = resolve(__dirname, "../scripts/init.js");
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ stderr: ${stderr}`);
    }
    console.log(stdout);
  });
} else {
  console.log("🧭 Usage: ZephyrExt <command>");
  console.log("Available commands: publish, init");
}
