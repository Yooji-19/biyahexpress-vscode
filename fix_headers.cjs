
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const logoURL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBpt6VD6taaf8BllkliQ4wCRtIlg8m3K6_LA0paWwaTO3_YMCEfmQFTYZpDAsavNExqLfLKz_zJr3l-EWOiLf8PxypBh5vaw894L6Z93H1FK4DqaGhEzLCUVbgllEmmRtwzEyYxB3TZ-ODD36leP-IKsUEgEkTJ78T3JODT4_VdkM44Z35rfCD83s_RfVdJZYw5A5hGThuZbcVnGaS_ofX5SUeaP2LgONrgj7YcVeZlcAuiDlXTufQ1mb98iBl9cb57L00";

const headerCSS = `
<style id="fixed-biyahexpress-header">
  .app-header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 64px !important;
    padding: 0 16px !important;
    background: #f8f9ff !important;
    display: flex !important;
    align-items: center !important;
    z-index: 100 !important;
    box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  }

  .app-header .logo-icon {
    display: flex !important;
    align-items: center !important;
    width: 31px !important;
    height: 40px !important;
    overflow: hidden !important;
    flex-shrink: 0;
    cursor: pointer;
  }

  .app-header .logo-icon img {
    height: 40px !important;
    width: auto !important;
    max-width: none !important;
    max-height: none !important;
    flex-shrink: 0;
  }

  .app-header .logo-icon:focus-visible {
    outline: 3px solid #295ea6;
    outline-offset: 4px;
  }

  body {
    padding-top: 64px !important;
  }

  body > main {
    padding-top: 16px !important;
  }
</style>
`;

const headerHTML = `
<header class="app-header">
  <a
    href="/pages/map.html"
    class="logo-icon"
    aria-label="Return to Accessibility Map"
    title="Back to Map"
  >
    <img
      src="${logoURL}"
      alt="BiyahExpress Logo"
    >
  </a>
</header>
`;

if (!fs.existsSync(pagesFolder)) {
  console.error("Pages folder not found.");
  process.exit(1);
}

const files = fs.readdirSync(pagesFolder)
  .filter(file => file.endsWith(".html"));

for (const file of files) {

  // Keep the original login screen
  if (file === "welcome.html") {
    console.log("Kept login:", file);
    continue;
  }

  const filePath = path.join(pagesFolder, file);

  let html = fs.readFileSync(filePath, "utf8");

  // Back up before changing anything
  const backup = filePath + ".before-header-fix.bak";

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(filePath, backup);
  }

  // Remove previously generated header styles
  html = html.replace(
    /<style\b[^>]*id=["'](?:biyahexpress-header-style|fixed-biyahexpress-header)["'][^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // Replace existing header or restore missing header
  if (/<header\b[^>]*>[\s\S]*?<\/header>/i.test(html)) {
    html = html.replace(
      /<header\b[^>]*>[\s\S]*?<\/header>/i,
      headerHTML
    );
  } else if (/<body\b[^>]*>/i.test(html)) {
    html = html.replace(
      /<body\b[^>]*>/i,
      match => match + "\n" + headerHTML
    );
  } else {
    console.log("Skipped invalid HTML:", file);
    continue;
  }

  // Add header CSS
  html = html.replace(
    /<\/head>/i,
    headerCSS + "\n</head>"
  );

  // Make remaining dashboard links lead to Map
  html = html.replace(
    /href=(["'])\/pages\/dashboard\.html\1/gi,
    'href="/pages/map.html"'
  );

  fs.writeFileSync(filePath, html, "utf8");

  console.log("Fixed header:", file);
}

console.log("All available app page headers updated.");
console.log("Logo now returns to Accessibility Map.");
