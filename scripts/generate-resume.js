// Generates public/resume/Shreyas_Pawar_Resume.pdf (A4, Helvetica, no deps).
// Run: node scripts/generate-resume.js

const fs = require("node:fs");
const path = require("node:path");

const W = 595.28;
const H = 841.89;
const ML = 60;
const MR = 60;
const MT = 66;
const MB = 60;
const LW = W - ML - MR;

const escape = (s) =>
  String(s)
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u00B7/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/&/g, "&amp;")
    .replace(/\\/g, "\\\\")
    .replace(/[()]/g, (c) => `\\${c}`)
    .replace(/[^\x20-\x7E]/g, "");

const wrap = (text, charsPerLine) => {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length <= charsPerLine) {
      line = (line + " " + word).trim();
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const pages = [];
let y = 0;

const newPage = () => {
  pages.push("");
  y = H - MT;
};

const put = (x, yPos, font, size, text) => {
  const current = pages[pages.length - 1];
  pages[pages.length - 1] =
    current + `BT /${font} ${size} Tf ${x.toFixed(2)} ${yPos.toFixed(2)} Td (${escape(text)}) Tj ET\n`;
};

const textBlock = (x, size, leading, content, charsPerLine) => {
  for (const line of wrap(content, charsPerLine)) {
    if (y - leading < MB) newPage();
    put(x, y, size >= 13 ? "F2" : "F1", size, line);
    y -= leading;
  }
};

const sectionTitle = (title) => {
  y -= 6;
  if (y - 34 < MB) newPage();
  put(ML, y, "F2", 13, title);
  y -= 22;
  put(ML, y, "F1", 8, "______________________________________________________");
  y -= 10;
};

const heading = (text) => {
  if (y - 22 < MB) newPage();
  put(ML, y, "F2", 11, text);
  y -= 15;
};

const meta = (text) => {
  if (y - 14 < MB) newPage();
  put(ML, y, "F1", 9.5, text);
  y -= 12;
};

const body = (text, indent = 0) => {
  const x = ML + indent;
  const width = LW - indent;
  textBlock(x, 9.5, 12.5, text, Math.floor(width / 4.8));
};

newPage();

// Header
put(ML, y, "F2", 24, "SHREYAS PAWAR");
y -= 24;
put(ML, y, "F1", 11, "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases");
y -= 17;
put(ML, y, "F1", 9, "shreyaspawar1011@gmail.com | linkedin.com/in/shreyaspawar10 | github.com/ShreyasP10 | Thane, Maharashtra, India (IST)");
y -= 26;

// Education
sectionTitle("EDUCATION");
for (const e of [
  { d: "B.Tech in Computer Engineering", i: "A. P. Shah Institute of Technology, Thane", p: "2025 - 2028" },
  { d: "Diploma in Information Technology", i: "Muchhala Polytechnic, Thane", p: "Aug 2022 - May 2025" },
]) {
  heading(`${e.d} - ${e.i}`);
  meta(e.p);
  y -= 8;
}

// Experience
sectionTitle("EXPERIENCE");
for (const e of [
  {
    r: "Internship - Mobile Application Development (Dart & Flutter)",
    c: "New Age Solutions & Technologies (NASTECH)",
    p: "Jun 2025 - Jul 2025",
    d: "Completed a 6-week industrial training program in Mobile Application Development with Dart & Flutter. Built interactive cross-platform apps, mastered state management, widgets and navigation, and applied real-world debugging and testing workflows on project-based assignments.",
    s: "Flutter, Dart, UI/UX",
  },
  {
    r: "Presenter - CropIQ Crop Disease Identifier Application",
    c: "MSBTE State Level Project Competition 2025",
    p: "Mar 2025",
    d: "Represented Muchhala Polytechnic at the MSBTE State Level Project Competition 2025 (Mumbai Region), presenting an AI-powered Android application using Computer Vision and Deep Learning (CNN via TensorFlow) for early crop disease detection with actionable guidance.",
    s: "Android, Java, Kotlin, TensorFlow, Firebase",
  },
]) {
  heading(e.r);
  meta(`${e.c} | ${e.p}`);
  body(e.d);
  if (e.s) meta(`Skills: ${e.s}`);
  y -= 8;
}

// Hackathons
sectionTitle("HACKATHONS");
for (const h of [
  ["Kepler-404", "ISRO Space Applications Centre, BAH 2026 - AI prototype that super-resolves Landsat 9 Thermal Infrared imagery (200m to 100m), colorizes thermal bands, preserves CRS/affine metadata for GIS and exports GeoTIFF."],
  ["Camptel AI", "Gen AI Academy APAC Edition, Google Cloud Hackathon 2026 - campus decision-intelligence: academic risk scoring, placement readiness tiers, classroom utilization heatmaps and a natural-language-to-SQL AI assistant. 11x GPU speedup with NVIDIA RAPIDS on 1.2M records."],
  ["AI for Learning & Developer Productivity", "AWS AI for Bharat Hackathon - AI tutor, role-based interview prep, summarizer, multilingual translation, code analyzer, quiz/flashcard generator and multimodal OCR."],
  ["CropIQ", "MSBTE State Level Project Competition 2025 - AI crop disease detection app (CNN via TensorFlow) with recommended solutions for farmers."],
]) {
  heading(h[0]);
  body(h[1]);
  y -= 8;
}

// Projects
sectionTitle("PROJECTS");
for (const p of [
  ["Chatrixz (2026)", "Real-time end-to-end encrypted chat: every message AES-256-GCM encrypted on the client, Firestore stores only ciphertext; encrypted replies, read receipts, file sharing, WebRTC voice calls, PWA with offline support."],
  ["Kepler-404 (2026)", "Satellite-imagery super-resolution + thermal colorization web tool with before/after comparison and GeoTIFF export."],
  ["Camptel AI (2026)", "Campus intelligence platform with AI assistant (Next.js, BigQuery, Gemini AI, NVIDIA RAPIDS cuDF)."],
  ["CropIQ (2025)", "Crop disease detection platform: Android app (Java/Kotlin), web portal, admin dashboard, CNN via TensorFlow Lite, FCM push updates."],
]) {
  heading(p[0]);
  body(p[1]);
  y -= 8;
}

// Certifications
sectionTitle("CERTIFICATIONS");
for (const c of [
  ["Data Science Master Virtual Internship", "Siemens", "Apr 2026"],
  ["The Ultimate Job Ready Data Science Course", "CodeWithHarry", "Mar 2026"],
]) {
  heading(`${c[0]} - ${c[1]}`);
  meta(c[2]);
  y -= 8;
}

// Skills
sectionTitle("SKILLS");
const groups = [
  ["Languages", "Python, Java, Kotlin, JavaScript, TypeScript, C, C++, Dart, HTML, CSS, SQL, XML"],
  ["Frameworks & Libraries", "React.js, Next.js, Flutter, Tailwind CSS, Flask, FastAPI, SQLAlchemy, TensorFlow, TensorFlow Lite, PyTorch, OpenCV, Scikit-Learn, Rasterio, GDAL"],
  ["Data Science & ML", "Machine Learning, Deep Learning, Pandas, NumPy, Matplotlib, Seaborn, Web Scraping, Data Analysis"],
  ["Mobile & Cloud", "Android Development, Firebase, Firestore, Google BigQuery, Gemini AI, NVIDIA RAPIDS, Vercel, WebRTC"],
];
for (const [cat, skills] of groups) {
  heading(cat);
  body(skills);
  y -= 8;
}

// ---- Assemble PDF ----
const parts = [];

parts.push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
const count = pages.length;
const pageObjs = [];
for (let i = 0; i < count; i++) {
  pageObjs.push(3 + i * 2);
}

const kids = pageObjs.map((o) => `${o} 0 R`).join(" ");

parts.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
parts.push(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${count} >>\nendobj\n`);

const fontObj1 = 2 + count * 2 + 1;
const fontObj2 = fontObj1 + 1;

for (let i = 0; i < count; i++) {
  const pageObj = pageObjs[i];
  const contentObj = pageObj + 1;
  const stream = pages[i];
  parts.push(
    `${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${fontObj1} 0 R /F2 ${fontObj2} 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`
  );
  parts.push(
    `${contentObj} 0 obj\n<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream\nendobj\n`
  );
}

parts.push(`${fontObj1} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
parts.push(`${fontObj2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

const objTotal = parts.length + 1;
const numToXref = (n, len) => String(n).padStart(len, "0");
let xrefTable = `xref\n0 ${objTotal}\n`;
let objNumber = 1;
let runningOffset = 0;
const actualOffsets = [0];
for (let i = 0; i < parts.length; i++) {
  runningOffset += Buffer.byteLength(parts[i], "latin1");
  actualOffsets[objNumber] = runningOffset;
  objNumber++;
}
for (let i = 0; i < objTotal; i++) {
  if (i === 0) {
    xrefTable += "0000000000 65535 f \n";
  } else {
    xrefTable += `${numToXref(actualOffsets[i], 10)} 00000 n \n`;
  }
}

const trailer = `trailer\n<< /Size ${objTotal} /Root 1 0 R >>\nstartxref\n${runningOffset}\n%%EOF\n`;

const output = Buffer.concat([
  ...parts.map((p) => Buffer.from(p, "latin1")),
  Buffer.from(xrefTable, "latin1"),
  Buffer.from(trailer, "latin1"),
]);

const outDir = path.join(__dirname, "..", "public", "resume");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "Shreyas_Pawar_Resume.pdf");
fs.writeFileSync(outFile, output);
console.log(`Wrote ${outFile} (${output.length} bytes, ${count} page(s))`);
