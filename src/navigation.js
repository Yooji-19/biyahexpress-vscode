
/*
  BiyahExpress Navigation
  Main page: Accessibility Map

  Pages:
  - Map
  - Reports
  - Settings
  - More / Profile

  Preserves existing HTML links and design.
*/

const current = window.location.pathname
  .split("/")
  .pop()
  .replace(".html", "");

const routes = {
  welcome: "/pages/welcome.html",
  map: "/pages/map.html",
  report: "/pages/report.html",
  settings: "/pages/settings.html",
  preferences: "/pages/preferences.html",
  planner: "/pages/planner.html",
  route: "/pages/route.html",
  confirmation: "/pages/confirmation.html",
  heatmap: "/pages/heatmap.html",
  analytics: "/pages/analytics.html"
};

function go(page) {
  if (routes[page]) {
    window.location.href = routes[page];
  }
}

/*
  Fix navigation links with href="#".
  Existing valid links are left untouched.
*/

const navigationPaths = {
  "spatial-map": "map",
  "hazard-reports": "report",
  "settings": "settings",
  "user-profile": "preferences",
  "dashboard": "map"
};

document.querySelectorAll("nav a").forEach(link => {
  const path = link.dataset.path;

  if (navigationPaths[path]) {
    link.href = routes[navigationPaths[path]];
  }
});

/*
  Handle prototype action buttons.
*/

document.addEventListener("click", event => {
  const target = event.target.closest("a, button");

  if (!target) return;

  const text = (target.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // Allow existing real links to navigate normally.
  if (target.tagName === "A") {
    const href = target.getAttribute("href");

    if (href && href !== "#") {
      return;
    }
  }

  let destination = null;

  // Login goes to Map.
  if (
    current === "welcome" &&
    /log in|create account|continue as guest/.test(text)
  ) {
    destination = "map";
  }

  // Route planner.
  else if (
    current === "planner" &&
    /view routes|start navigation/.test(text)
  ) {
    destination = "route";
  }

  // Reporting.
  else if (/submit hazard report/.test(text)) {
    destination = "confirmation";
  }

  else if (/view report status/.test(text)) {
    destination = "confirmation";
  }

  else if (/analytical breakdown/.test(text)) {
    destination = "analytics";
  }

  else if (/report hazard at current pin/.test(text)) {
    destination = "report";
  }

  else if (/navigate here/.test(text)) {
    destination = "planner";
  }

  // Back arrows.
  else if (
    target.tagName === "BUTTON" &&
    /arrow_back/.test(text)
  ) {
    const backRoutes = {
      planner: "map",
      route: "planner",
      report: "map",
      settings: "map",
      preferences: "map",
      heatmap: "map",
      analytics: "map",
      confirmation: "report"
    };

    destination = backRoutes[current] || "map";
  }

  // Old Stitch navigation links.
  else if (
    target.tagName === "A" &&
    target.getAttribute("href") === "#"
  ) {
    const path = target.dataset.path;

    if (navigationPaths[path]) {
      destination = navigationPaths[path];
    }
  }

  if (destination) {
    event.preventDefault();
    go(destination);
  }
});
