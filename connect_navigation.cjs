
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const navigationScript =
  '<script type="module" src="/src/navigation.js"></script>';

const apply = process.argv.includes("--apply");

if (!fs.existsSync(pagesFolder)) {
  console.error("Pages folder not found.");
  process.exit(1);
}

if (!fs.existsSync(path.join(__dirname, "src", "navigation.js"))) {
  console.error("src/navigation.js not found.");
  process.exit(1);
}

const files = fs.readdirSync(pagesFolder)
  .filter(file => file.endsWith(".html"));

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesFolder, file);
  const original = fs.readFileSync(filePath, "utf8");

  // Avoid adding the script twice.
  if (/<script\b[^>]*src=["']\/src\/navigation\.js["'][^>]*>\s*<\/script>/i.test(original)) {
    console.log(`Already connected: ${file}`);
    continue;
  }

  // Only modify valid pages with a closing body tag.
  if (!/<\/body>/i.test(original)) {
    console.log(`Skipped (no closing body): ${file}`);
    continue;
  }

  const updated = original.replace(
    /<\/body>/i,
    `  ${navigationScript}\n</body>`
  );

  console.log(`${apply ? "Connected" : "Would connect"}: ${file}`);
  updatedCount++;

  if (apply) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}

console.log("");
console.log(`Pages to update: ${updatedCount}`);

if (!apply) {
  console.log("Preview complete. No files were changed.");
  console.log("Run with --apply to connect the pages.");
} else {
  console.log("Navigation connection complete.");
}
