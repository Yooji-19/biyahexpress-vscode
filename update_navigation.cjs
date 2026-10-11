
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const applyChanges = process.argv.includes("--apply");

const routes = {
  "spatial-map": "/pages/map.html",
  "hazard-reports": "/pages/report.html",
  "settings": "/pages/settings.html",
  "user-profile": "/pages/preferences.html",
  "dashboard": "/pages/map.html"
};

console.log(
  applyChanges
    ? "APPLY MODE: Updating navigation links"
    : "PREVIEW MODE: No files will be modified"
);

if (!fs.existsSync(pagesFolder)) {
  console.error("Pages folder not found.");
  process.exit(1);
}

const files = fs.readdirSync(pagesFolder)
  .filter(file => file.endsWith(".html"));

let totalChanges = 0;

for (const file of files) {
  const filePath = path.join(pagesFolder, file);
  const original = fs.readFileSync(filePath, "utf8");

  let fileChanges = 0;

  /*
    Change href only on navigation links
    with known data-path values.

    Preserve classes, icons, text and structure.
  */

  const updated = original.replace(
    /<a\b[^>]*>[\s\S]*?<\/a>/gi,
    anchor => {
      const match = anchor.match(
        /\bdata-path=["']([^"']+)["']/i
      );

      if (!match) return anchor;

      const page = match[1];
      const destination = routes[page];

      if (!destination) return anchor;

      const openingTagMatch = anchor.match(/^<a\b[^>]*>/i);

      if (!openingTagMatch) return anchor;

      const openingTag = openingTagMatch[0];

      let updatedTag;

      if (/\bhref=["'][^"']*["']/i.test(openingTag)) {
        updatedTag = openingTag.replace(
          /\bhref=["'][^"']*["']/i,
          `href="${destination}"`
        );
      } else {
        updatedTag = openingTag.replace(
          /^<a\b/i,
          `<a href="${destination}"`
        );
      }

      if (openingTag === updatedTag) {
        return anchor;
      }

      fileChanges++;

      return updatedTag + anchor.slice(openingTag.length);
    }
  );

  if (fileChanges === 0) {
    console.log(`OK: ${file}`);
    continue;
  }

  totalChanges += fileChanges;

  console.log(
    `${applyChanges ? "Updated" : "Would update"}: ` +
    `${file} (${fileChanges} links)`
  );

  if (applyChanges) {
    const backup = filePath + ".nav-backup";

    if (!fs.existsSync(backup)) {
      fs.copyFileSync(filePath, backup);
    }

    fs.writeFileSync(filePath, updated, "utf8");
  }
}

console.log("");
console.log("Total navigation links:", totalChanges);

if (!applyChanges) {
  console.log("Preview complete. No files were changed.");
  console.log("Run with --apply to make the changes.");
} else {
  console.log("Navigation update complete.");
}
