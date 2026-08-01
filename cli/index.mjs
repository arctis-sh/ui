#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const registryDir = path.join(packageRoot, "registry");

function usage() {
  console.log(`Usage:
  npx @arctis-sh/ui add <name> [...names]

Examples:
  npx @arctis-sh/ui add button
  npx @arctis-sh/ui add slider pricing-01
  npx @arctis-sh/ui add banner-01

Copies selected components and blocks into your project (with dependencies).`);
}

function findProjectRoot(cwd) {
  let dir = cwd;
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return cwd;
    dir = parent;
  }
}

function loadItem(name) {
  const file = path.join(registryDir, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function resolveTree(names) {
  const queue = [...names];
  const seen = new Set();
  const items = [];
  const missing = [];

  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    seen.add(name);
    const item = loadItem(name);
    if (!item) {
      missing.push(name);
      continue;
    }
    items.push(item);
    for (const dep of item.registryDependencies ?? []) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return { items, missing };
}

function writeFiles(projectRoot, items) {
  const written = [];
  for (const item of items) {
    for (const file of item.files ?? []) {
      const target = path.join(projectRoot, file.target ?? file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.content ?? "");
      written.push(path.relative(projectRoot, target));
    }
  }
  return written;
}

function collectNpmDeps(items) {
  const deps = new Set();
  for (const item of items) {
    for (const dep of item.dependencies ?? []) deps.add(dep);
  }
  return [...deps].sort();
}

function installDeps(projectRoot, deps) {
  if (!deps.length) return;
  const pkgPath = path.join(projectRoot, "package.json");
  let existing = {};
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    existing = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    };
  }
  const needed = deps.filter((dep) => !existing[dep]);
  if (!needed.length) {
    console.log("Dependencies already installed.");
    return;
  }
  console.log(`Installing ${needed.join(", ")}…`);
  const result = spawnSync("npm", ["install", ...needed], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    console.error("npm install failed. Install manually:", needed.join(" "));
    process.exitCode = 1;
  }
}

function main(argv) {
  const [cmd, ...names] = argv;
  if (!cmd || cmd === "-h" || cmd === "--help") {
    usage();
    return;
  }
  if (cmd !== "add") {
    console.error(`Unknown command: ${cmd}`);
    usage();
    process.exitCode = 1;
    return;
  }
  if (!names.length) {
    console.error("Pass at least one component or block name.");
    usage();
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(registryDir)) {
    console.error("Registry missing. Run npm run build:registry in @arctis-sh/ui.");
    process.exitCode = 1;
    return;
  }

  const projectRoot = findProjectRoot(process.cwd());
  const { items, missing } = resolveTree(names);
  if (missing.length) {
    console.error(`Unknown: ${missing.join(", ")}`);
    const indexPath = path.join(registryDir, "index.json");
    if (fs.existsSync(indexPath)) {
      const { items: all } = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      console.error(`Available: ${all.map((i) => i.name).join(", ")}`);
    }
    process.exitCode = 1;
    return;
  }

  const written = writeFiles(projectRoot, items);
  console.log(`Added ${names.join(", ")} → ${projectRoot}`);
  for (const file of written) console.log(`  + ${file}`);

  const npmDeps = collectNpmDeps(items);
  installDeps(projectRoot, npmDeps);

  console.log("\nImport from your aliases, e.g.");
  console.log('  import { Button } from "@/components/ui/button"');
  console.log('  import { Pricing01 } from "@/components/blocks/pricing/pricing-01"');
}

main(process.argv.slice(2));
