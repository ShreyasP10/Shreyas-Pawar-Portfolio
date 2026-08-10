import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = process.cwd();
const PORT = 4444;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".glb": "model/gltf-binary",
  ".json": "application/json",
  ".png": "image/png",
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let path = decodeURIComponent(url.pathname);
  if (path === "/" || path === "/index.html") {
    path = "/scripts/glb-preview/index.html";
  } else if (path.startsWith("/lib/addons/")) {
    path = "/node_modules/three/examples/jsm/" + path.slice("/lib/addons/".length);
  } else if (path.startsWith("/lib/")) {
    path = "/node_modules/three/build/" + path.slice("/lib/".length);
  } else if (path.endsWith("/")) {
    path += "index.html";
  }

  const file = normalize(join(ROOT, path));
  if (!file.startsWith(normalize(ROOT))) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(PORT, () => console.log(`glb-preview on http://localhost:${PORT}`));
