import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { version: null, out: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--version") {
      const value = argv[i + 1];
      if (!value) fail("--version requires a value like 0.9.0");
      args.version = value;
      i += 1;
      continue;
    }
    if (token === "--out") {
      const value = argv[i + 1];
      if (!value) fail("--out requires a value like dist/foo.zip");
      args.out = value;
      i += 1;
      continue;
    }
    fail(`unknown arg: ${token}`);
  }
  return args;
}

function readJson(relPath) {
  const absPath = path.resolve(relPath);
  try {
    return JSON.parse(fs.readFileSync(absPath, "utf8"));
  } catch (err) {
    fail(`failed to read/parse ${relPath}: ${err.message}`);
  }
}

function ensureDir(relPath) {
  const absPath = path.resolve(relPath);
  fs.mkdirSync(absPath, { recursive: true });
}

const args = parseArgs(process.argv.slice(2));
const manifest = readJson("manifest.json");

if (!args.version) args.version = manifest.version;
if (args.version !== manifest.version) {
  fail(`--version ${args.version} does not match manifest.json version ${manifest.version}`);
}

ensureDir("dist");

const outPath = args.out ?? `dist/ChatGPT-Context-Counter-${args.version}.zip`;

const includePaths = [
  "manifest.json",
  "background.js",
  "config.js",
  "content.js",
  "styles.css",
  "learn.html",
  "learn.css",
  "estimators",
  "tokenizers",
  "vendor",
];

const zipArgs = ["-r", outPath, ...includePaths];
const result = spawnSync("zip", zipArgs, { stdio: "inherit" });
if (result.error) {
  fail(`failed to run zip: ${result.error.message}`);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`ok: created ${outPath}`);

