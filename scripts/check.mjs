import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const failures = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if ([".git", "dist", "node_modules"].includes(name)) return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function fail(message) {
  failures.push(message);
}

function localTarget(url) {
  const clean = url.split("#", 1)[0].split("?", 1)[0];
  if (!clean || clean.startsWith("#") || /^(?:https?:|mailto:|tel:)/.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const absolute = decoded.startsWith("/") ? join(root, decoded) : null;
  if (!absolute) return null;
  return decoded.endsWith("/") ? join(absolute, "index.html") : absolute;
}

const htmlFiles = walk(root).filter((path) => extname(path) === ".html");
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (!/^<!doctype html>/i.test(html)) fail(`${relative(root, file)}: missing HTML doctype`);
  if (!/<html lang="(?:en|tr)">/.test(html)) fail(`${relative(root, file)}: missing supported lang attribute`);
  if (!/<meta name="viewport"/.test(html)) fail(`${relative(root, file)}: missing viewport meta`);
  if (/https?:\/\/lockframe\.game(?:[\/:?#]|$)/.test(html)) fail(`${relative(root, file)}: wrong singular domain`);

  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    const target = localTarget(reference);
    if (target && !existsSync(target)) fail(`${relative(root, file)}: missing ${reference}`);
  }
}

for (const privacyPath of ["privacy/index.html", "privacy/tr/index.html"]) {
  const html = readFileSync(join(root, privacyPath), "utf8");
  if (/<script\b/i.test(html)) fail(`${privacyPath}: scripts are not allowed`);
  for (const alternatives of [["AdMob"], ["UMP"], ["Apple"], ["Prism", "Prizma"], ["deletion", "silme"], ["ogulcangogceloglu@gmail.com"], ["Unity Technologies"], ["IDFV"], ["Account &amp; Privacy", "Hesap ve Gizlilik"], ["102571"]]) {
    if (!alternatives.some((required) => html.toLocaleLowerCase("en").includes(required.toLocaleLowerCase("en")))) {
      fail(`${privacyPath}: missing privacy topic ${alternatives.join("/")}`);
    }
  }
}

// 0.7.1: the published policy must not claim missing in-app deletion (it now exists).
for (const page of ["privacy/index.html", "privacy/tr/index.html", "support/index.html", "support/tr/index.html"]) {
  const html = readFileSync(join(root, page), "utf8");
  if (/does not yet provide an in-app account-deletion|henüz uygulama içi hesap silme/i.test(html)) fail(`${page}: stale "no in-app deletion" statement`);
  if (/Help → Privacy Options|choose Privacy Options|Yardım → Gizlilik Seçenekleri|Yardım bölümünden Gizlilik/.test(html)) fail(`${page}: stale Privacy Options path`);
}

const sellerLine = readFileSync(join(root, "app-ads.txt"), "utf8").trim();
const requiredSellerLine = "google.com, pub-2858109238421461, DIRECT, f08c47fec0942fa0";
if (sellerLine !== requiredSellerLine) fail("app-ads.txt does not exactly match the required seller line");

for (const required of ["index.html", "tr/index.html", "privacy/index.html", "privacy/tr/index.html", "support/index.html", "support/tr/index.html", "robots.txt", "sitemap.xml", "_headers", "_redirects"]) {
  if (!existsSync(join(root, required))) fail(`missing required file ${required}`);
}

if (failures.length) {
  console.error(`LOCKFRAME site check failed (${failures.length}):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`LOCKFRAME site check passed: ${htmlFiles.length} HTML files, internal assets resolved, privacy pages script-free.`);
