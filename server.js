
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mind": "application/octet-stream"
};

http.createServer((req, res) => {
  let pathname;

  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname
    );
  } catch {
    res.writeHead(400);
    return res.end("URL không hợp lệ");
  }

  if (pathname === "/") pathname = "/index.html";

  const file = path.resolve(ROOT, "." + pathname);

  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(file, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end("Không tìm thấy file");
    }

    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()]
        || "application/octet-stream",
      "Cache-Control": "no-store"
    });

    fs.createReadStream(file).pipe(res);
  });

}).listen(PORT, "0.0.0.0", () => {
  console.log("AR CARD SERVER: http://localhost:" + PORT);
});
