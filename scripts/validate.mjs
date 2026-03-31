import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { expectVersion: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--expect-version") {
      const value = argv[i + 1];
      if (!value) fail("--expect-version requires a value like 0.9.0");
      args.expectVersion = value;
      i += 1;
      continue;
    }
    fail(`unknown arg: ${token}`);
  }
  return args;
}

function readText(relPath) {
  const absPath = path.resolve(relPath);
  try {
    return fs.readFileSync(absPath, "utf8");
  } catch (err) {
    fail(`failed to read ${relPath}: ${err.message}`);
  }
}

function readJson(relPath) {
  const text = readText(relPath);
  try {
    return JSON.parse(text);
  } catch (err) {
    fail(`invalid JSON in ${relPath}: ${err.message}`);
  }
}

function isSemver(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function latestChangelogVersion(changelogText) {
  const match = changelogText.match(/^##\s+\[(\d+\.\d+\.\d+)\]\s+-\s+(\d{4}-\d{2}-\d{2})\s*$/m);
  if (!match) return null;
  return { version: match[1], date: match[2] };
}

function fileExists(relPath) {
  const absPath = path.resolve(relPath);
  try {
    const stat = fs.statSync(absPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function collectManifestFiles(manifest) {
  const files = new Set();

  if (manifest?.background?.service_worker) {
    files.add(manifest.background.service_worker);
  }

  const contentScripts = manifest?.content_scripts;
  if (Array.isArray(contentScripts)) {
    for (const entry of contentScripts) {
      const jsFiles = Array.isArray(entry?.js) ? entry.js : [];
      const cssFiles = Array.isArray(entry?.css) ? entry.css : [];
      for (const file of jsFiles) files.add(file);
      for (const file of cssFiles) files.add(file);
    }
  }

  return [...files];
}

const args = parseArgs(process.argv.slice(2));

const manifest = readJson("manifest.json");
if (manifest.manifest_version !== 3) {
  fail(`manifest.json manifest_version must be 3 (got ${JSON.stringify(manifest.manifest_version)})`);
}

if (typeof manifest.name !== "string" || manifest.name.trim() === "") {
  fail("manifest.json name must be a non-empty string");
}

if (!isSemver(manifest.version)) {
  fail(`manifest.json version must be semver X.Y.Z (got ${JSON.stringify(manifest.version)})`);
}

const changelog = readText("CHANGELOG.md");
const latest = latestChangelogVersion(changelog);
if (!latest) {
  fail("CHANGELOG.md must include a heading like: ## [0.9.0] - 2026-03-29");
}

if (latest.version !== manifest.version) {
  fail(`manifest.json version (${manifest.version}) must match latest CHANGELOG.md version (${latest.version})`);
}

if (args.expectVersion && args.expectVersion !== manifest.version) {
  fail(`expected version ${args.expectVersion} but manifest.json is ${manifest.version}`);
}

const referencedFiles = collectManifestFiles(manifest);
if (referencedFiles.length === 0) {
  fail("manifest.json did not reference any script/style files to validate");
}

for (const relPath of referencedFiles) {
  if (typeof relPath !== "string" || relPath.trim() === "") {
    fail(`manifest.json referenced a non-string path: ${JSON.stringify(relPath)}`);
  }
  if (!fileExists(relPath)) {
    fail(`manifest.json references missing file: ${relPath}`);
  }
}

const runtimeFiles = ["learn.html", "learn.css"];
for (const relPath of runtimeFiles) {
  if (!fileExists(relPath)) {
    fail(`expected runtime file missing: ${relPath}`);
  }
}

console.log(`ok: manifest ${manifest.version} validated (${referencedFiles.length} referenced files)`);

