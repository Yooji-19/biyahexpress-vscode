
const fs = require("fs");
const path = require("path");

const pagesFolder = path.join(__dirname, "pages");

const settingsLink = `
<a
  href="/pages/settings.html"
  class="flex flex-col items-center justify-center w-16 min-h-[48px] py-1 text-on-surface-variant"
  data-path="settings"
>
  <div class="nav-pill w-14 h-8 flex items-center justify-center rounded-full">
    <span class="material-symbols-outlined text-[24px]">settings</span>
  </div>
  <span class="nav-label text-[11px] mt-1">Settings</span>
</a>`;

const files = fs.readdirSync(pagesFolder)
  .filter(file => file.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(pagesFolder, file);
  let html = fs.readFileSync(filePath, "utf8");

  // Avoid adding Settings twice
  if (html.includes('href="/pages/settings.html"')) {
    console.log(`Already has Settings: ${file}`);
    continue;
  }

  const navMatch = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/i);

  if (!navMatch) {
    console.log(`Skipped: ${file} (no navigation found)`);
    continue;
  }

  // Add Settings before the end of navigation
  const updatedNav = navMatch[0].replace(
    "</nav>",
    settingsLink + "\n</nav>"
  );

  // Backup original file
  if (!fs.existsSync(filePath + ".bak")) {
    fs.copyFileSync(filePath, filePath + ".bak");
  }

  html = html.replace(navMatch[0], updatedNav);

  fs.writeFileSync(filePath, html, "utf8");

  console.log(`Settings added: ${file}`);
}

console.log("Navigation update complete!");
