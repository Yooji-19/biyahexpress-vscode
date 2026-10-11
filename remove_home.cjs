
const fs = require("fs");
const path = require("path");

const root = __dirname;
const pagesFolder = path.join(root, "pages");
const navigationFile = path.join(root, "src", "navigation.js");

function updateFile(file, transform) {
  if (!fs.existsSync(file)) {
    console.log("Not found:", file);
    return;
  }

  const original = fs.readFileSync(file, "utf8");
  const updated = transform(original);

  if (original === updated) {
    console.log("No changes:", path.basename(file));
    return;
  }

  const backup = file + ".before-remove-home.bak";

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(file, backup);
  }

  fs.writeFileSync(file, updated, "utf8");

  console.log("Updated:", path.basename(file));
}

// 1. Update application navigation

updateFile(navigationFile, html => {

  // Remove dashboard from prototype page list
  html = html.replace(
    /\s*\['dashboard',\s*'Home Dashboard'\],?/g,
    ""
  );

  // Redirect login and guest access to Map
  html = html.replace(
    /destination\s*=\s*'preferences'(?=\s*;)/g,
    "destination = 'map'"
  );

  // Route existing dashboard destinations to Map
  html = html.replace(
    /destination\s*=\s*'dashboard'/g,
    "destination = 'map'"
  );

  // Replace dashboard destinations in back navigation
  html = html.replace(
    /:\s*'dashboard'/g,
    ": 'map'"
  );

  return html;
});

// 2. Update every HTML page

if (fs.existsSync(pagesFolder)) {
  const files = fs.readdirSync(pagesFolder)
    .filter(file => file.endsWith(".html"));

  for (const file of files) {
    const filePath = path.join(pagesFolder, file);

    updateFile(filePath, html => {

      // Remove Home navigation items.
      // Applies to bottom navigation links.
      html = html.replace(
        /<a\b(?=[^>]*href=["'](?:\/pages\/)?dashboard\.html["'])[^>]*>[\s\S]*?<\/a>/gi,
        ""
      );

      // Also remove original Stitch Home links
      html = html.replace(
        /<a\b(?=[^>]*data-path=["']dashboard["'])[^>]*>[\s\S]*?<\/a>/gi,
        ""
      );

      // Make existing dashboard links point to Map
      html = html.replace(
        /href=(["'])\/pages\/dashboard\.html\1/g,
        'href="/pages/map.html"'
      );

      // Change home-directed JS navigation
      html = html.replace(
        /location\.href\s*=\s*(["'])\/pages\/dashboard\.html\1/g,
        'location.href = "/pages/map.html"'
      );

      return html;
    });
  }
}

console.log("Home removed from navigation.");
console.log("Login now leads to Accessibility Map.");
