
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const targetPages = [
  "report.html",
  "preferences.html",
  "settings.html"
];

const backHeader = `
<header class="app-header">
  <a
    href="/pages/map.html"
    class="back-to-map"
    aria-label="Back to Map"
    title="Back to Map"
  >
    <span class="material-symbols-outlined">arrow_back</span>
    <span class="back-label">Back to Map</span>
  </a>
</header>
`;

const headerCSS = `
<style id="back-to-map-styles">
  .app-header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 64px !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 16px !important;
    background: #f8f9ff !important;
    z-index: 100 !important;
    box-shadow: 0 1px 5px rgba(0,0,0,.05);
  }

  .back-to-map {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #00346a;
    text-decoration: none;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 600;
  }

  .back-to-map .material-symbols-outlined {
    font-size: 23px;
  }

  .back-to-map:hover {
    opacity: 0.8;
  }

  .back-to-map:focus-visible {
    outline: 3px solid #295ea6;
    outline-offset: 4px;
    border-radius: 4px;
  }
</style>
`;

for (const file of targetPages) {
  const filePath = path.join(pagesFolder, file);

  if (!fs.existsSync(filePath)) {
    console.log("Skipped:", file);
    continue;
  }

  let html = fs.readFileSync(filePath, "utf8");

  // Replace previously generated back-to-map CSS
  html = html.replace(
    /<style\b[^>]*id=["']back-to-map-styles["'][^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // Replace only the header
  if (/<header\b[^>]*>[\s\S]*?<\/header>/i.test(html)) {
    html = html.replace(
      /<header\b[^>]*>[\s\S]*?<\/header>/i,
      backHeader
    );
  } else {
    html = html.replace(
      /<body\b[^>]*>/i,
      match => match + "\n" + backHeader
    );
  }

  // Add styles
  html = html.replace(
    /<\/head>/i,
    headerCSS + "\n</head>"
  );

  fs.writeFileSync(filePath, html, "utf8");

  console.log("Updated:", file);
}

console.log("Back to Map headers are ready.");
