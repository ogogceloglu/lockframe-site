import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicRoot = existsSync(join(root, "dist", "index.html")) ? join(root, "dist") : root;
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const safePath = normalize(pathname).replace(/^(?:\.\.(?:\/|\\|$))+/, "");
  let file = join(publicRoot, safePath);
  if (!file.startsWith(publicRoot)) file = join(publicRoot, "404.html");
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) file = join(publicRoot, "404.html");
  response.statusCode = file.endsWith("404.html") ? 404 : 200;
  response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  response.setHeader("X-Content-Type-Options", "nosniff");
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`LOCKFRAME site: http://127.0.0.1:${port}`);
});

