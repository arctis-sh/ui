import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "registry");
const uiDir = path.join(root, "src", "components", "ui");
const libDir = path.join(root, "src", "lib");
const blocksRoot = path.resolve(root, "..", "ui.arctis", "src", "components", "blocks");
const brandLogo = path.resolve(
  root,
  "..",
  "ui.arctis",
  "src",
  "components",
  "brand",
  "logo.tsx",
);

const NPM_PACKAGES = new Set([
  "@base-ui/react",
  "@tanstack/react-table",
  "embla-carousel-react",
  "embla-carousel-autoplay",
  "input-otp",
  "react-resizable-panels",
  "tailwind-merge",
  "@dnd-kit/core",
  "@dnd-kit/sortable",
  "@dnd-kit/utilities",
  "react-icons",
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseImports(source) {
  const deps = new Set();
  const registryDeps = new Set();
  const re =
    /from\s+["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(source))) {
    const spec = match[1];
    if (spec.startsWith("@/components/ui/")) {
      registryDeps.add(spec.replace("@/components/ui/", ""));
      continue;
    }
    if (spec === "@/lib/utils") {
      registryDeps.add("utils");
      continue;
    }
    if (spec.startsWith("@/lib/")) {
      registryDeps.add(spec.replace("@/lib/", ""));
      continue;
    }
    if (spec === "@/components/brand" || spec.startsWith("@/components/brand/")) {
      registryDeps.add("logo");
      continue;
    }
    if (spec === "react" || spec === "react-dom" || spec.startsWith("react/")) {
      continue;
    }
    if (spec.startsWith("@base-ui/react")) {
      deps.add("@base-ui/react");
      continue;
    }
    if (spec.startsWith("react-icons")) {
      deps.add("react-icons");
      continue;
    }
    const pkg = spec.startsWith("@")
      ? spec.split("/").slice(0, 2).join("/")
      : spec.split("/")[0];
    if (NPM_PACKAGES.has(pkg)) deps.add(pkg);
  }
  return {
    dependencies: [...deps].sort(),
    registryDependencies: [...registryDeps].sort(),
  };
}

function writeItem(item) {
  const file = path.join(outDir, `${item.name}.json`);
  fs.writeFileSync(file, `${JSON.stringify(item, null, 2)}\n`);
}

ensureDir(outDir);
for (const name of fs.readdirSync(outDir)) {
  if (name.endsWith(".json")) fs.unlinkSync(path.join(outDir, name));
}

const index = [];

// utils + hooks
for (const file of fs.readdirSync(libDir).filter((f) => f.endsWith(".ts"))) {
  const name = file.replace(/\.ts$/, "");
  const content = fs.readFileSync(path.join(libDir, file), "utf8");
  const { dependencies, registryDependencies } = parseImports(content);
  const item = {
    name,
    type: name === "utils" ? "registry:lib" : "registry:hook",
    title: name,
    dependencies,
    registryDependencies,
    files: [
      {
        path: `lib/${file}`,
        type: name === "utils" ? "registry:lib" : "registry:hook",
        target: `lib/${file}`,
        content,
      },
    ],
  };
  writeItem(item);
  index.push({ name, type: item.type });
}

// logo
if (fs.existsSync(brandLogo)) {
  const content = fs.readFileSync(brandLogo, "utf8");
  const indexContent = `export { Logo } from "./logo";\n`;
  const item = {
    name: "logo",
    type: "registry:component",
    title: "Logo",
    description: "Arctis logo mark.",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/brand/logo.tsx",
        type: "registry:component",
        target: "components/brand/logo.tsx",
        content,
      },
      {
        path: "components/brand/index.ts",
        type: "registry:component",
        target: "components/brand/index.ts",
        content: indexContent,
      },
    ],
  };
  writeItem(item);
  index.push({ name: "logo", type: item.type });
}

// ui components
for (const file of fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx"))) {
  const name = file.replace(/\.tsx$/, "");
  const content = fs.readFileSync(path.join(uiDir, file), "utf8");
  const { dependencies, registryDependencies } = parseImports(content);
  const item = {
    name,
    type: "registry:ui",
    title: name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" "),
    dependencies,
    registryDependencies,
    files: [
      {
        path: `components/ui/${file}`,
        type: "registry:ui",
        target: `components/ui/${file}`,
        content,
      },
    ],
  };
  writeItem(item);
  index.push({ name, type: item.type });
}

// blocks from docs repo
if (fs.existsSync(blocksRoot)) {
  for (const category of fs.readdirSync(blocksRoot, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    const catDir = path.join(blocksRoot, category.name);
    for (const file of fs.readdirSync(catDir).filter((f) => f.endsWith(".tsx"))) {
      const name = file.replace(/\.tsx$/, "");
      const content = fs.readFileSync(path.join(catDir, file), "utf8");
      const { dependencies, registryDependencies } = parseImports(content);
      const item = {
        name,
        type: "registry:block",
        title: name,
        dependencies,
        registryDependencies,
        files: [
          {
            path: `components/blocks/${category.name}/${file}`,
            type: "registry:block",
            target: `components/blocks/${category.name}/${file}`,
            content,
          },
        ],
      };
      writeItem(item);
      index.push({ name, type: item.type });
    }
  }
} else {
  console.warn("blocks source missing:", blocksRoot);
}

index.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(
  path.join(outDir, "index.json"),
  `${JSON.stringify({ items: index }, null, 2)}\n`,
);

console.log(`Wrote ${index.length} registry items → ${outDir}`);
