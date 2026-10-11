import { cpSync, mkdirSync, rmSync } from "node:fs";
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

console.log(`Built ${publicPaths.length} public paths into dist/.`);

