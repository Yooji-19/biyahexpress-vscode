
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const headerStyle = `
<style id="biyahexpress-header-style">
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background: #f8f9ff;
    display: flex;
    align-items: center;
    padding: 0 16px;
    z-index: 50;
    box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  }

  .logo-icon {
    width: 31px;
    height: 40px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .logo-icon img {
    height: 40px;
    width: auto;
    max-width: none;
    max-height: none;
    flex-shrink: 0;
  }

  main {
    padding-top: 80px !important;
  }
</style>
`;

for (const file of fs.readdirSync(pagesFolder)) {
  if (!file.endsWith(".html")) continue;

  const filePath = path.join(pagesFolder, file);
  let html = fs.readFileSync(filePath, "utf8");

  // Find the logo image in the header.
  const headerMatch = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i);

  if (!headerMatch) {
    console.log(`Skipped: ${file} (no header)`);
    continue;
  }

  const imgMatch = headerMatch[0].match(
    /<img\b(?=[^>]*alt=["'][^"']*logo[^"']*["'])[^>]*>/i
  );

  if (!imgMatch) {
    console.log(`Skipped: ${file} (no logo found)`);
    continue;
  }

  const srcMatch = imgMatch[0].match(/src=["']([^"']+)["']/i);

  if (!srcMatch) {
    console.log(`Skipped: ${file} (no logo source)`);
    continue;
  }

  const logoSrc = srcMatch[1];

  
const newHeader = `
<header class="app-header">
  <a
    href="/pages/dashboard.html"
    class="logo-icon"
    aria-label="Go to Home Dashboard"
    title="Go to Home"
    style="cursor: pointer;"
  >
    <img src="${logoSrc}" alt="BiyahExpress Logo">
  </a>
</header>`;


  // Create a backup before editing.
  const backupPath = filePath + ".bak";

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  // Replace the original header.
  html = html.replace(headerMatch[0], newHeader);

  // Add styles only once.
  if (!html.includes('id="biyahexpress-header-style"')) {
    html = html.replace("</head>", headerStyle + "\n</head>");
  }

  fs.writeFileSync(filePath, html, "utf8");

  console.log(`Updated: ${file}`);
}

console.log("Finished updating page headers.");


const statusBarPattern = /<div\b[^>]*class=["'][^"']*h-6[^"']*["'][^>]*>\s*<span[^>]*>9:41<\/span>[\s\S]*?battery_full<\/span>\s*<\/div>\s*<\/div>/gi;

for (const file of fs.readdirSync(pagesFolder)) {
  if (!file.endsWith(".html")) continue;

  const filePath = path.join(pagesFolder, file);
  let html = fs.readFileSync(filePath, "utf8");

  const updated = html.replace(statusBarPattern, "");

  if (updated !== html) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Removed phone status bar: ${file}`);
  }
}
