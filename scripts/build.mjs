import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = join(root, "dist");

if (output !== join(root, "dist")) throw new Error("Refusing to build outside the expected dist directory");
rmSync(output, { recursive: true, force: true });
mkdirSync(output);

const publicPaths = [
  "index.html",
  "404.html",
  "app-ads.txt",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "_redirects",
  "assets",
  "privacy",
  "support",
  "tr"
];

for (const path of publicPaths) {
  cpSync(join(root, path), join(output, path), { recursive: true });
}

// HTML must reference the matching CSS release, even while an older asset remains cached.
const stylesheet = readFileSync(join(output, "assets/css/styles.css"));
const cssHash = createHash("sha256").update(stylesheet).digest("hex").slice(0, 12);
const cssName = `styles-${cssHash}.css`;
writeFileSync(join(output, "assets/css", cssName), stylesheet);

function versionStylesheets(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) versionStylesheets(path);
    else if (entry.name.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      writeFileSync(path, html.replaceAll('href="/assets/css/styles.css"', `href="/assets/css/${cssName}"`));
    }
  }
}
versionStylesheets(output);

console.log(`Built ${publicPaths.length} public paths into dist/.`);

