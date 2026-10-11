
/*
  BiyahExpress Navigation
  Main page: Map

  This script repairs navigation links without
  changing the HTML design or header.
*/

const routes = {
  "spatial-map": "/pages/map.html",
  "hazard-reports": "/pages/report.html",
  "settings": "/pages/settings.html",
  "user-profile": "/pages/preferences.html",
  "dashboard": "/pages/map.html"
};

// Correct navigation links that use data-path.
document.querySelectorAll("nav a[data-path]").forEach(link => {
  const destination = routes[link.dataset.path];

  if (destination) {
    link.setAttribute("href", destination);
  }
});

// Handle navigation clicks, including old Stitch links.
document.addEventListener("click", event => {
  const target = event.target.closest("a, button");

  if (!target) return;

  const navLink = target.closest("nav a");

  if (navLink) {
    const path = navLink.dataset.path;

    let destination = routes[path];

    // Fallback for links without data-path
    if (!destination) {
      const label = navLink.textContent.trim().toLowerCase();

      if (label.includes("settings")) {
        destination = "/pages/settings.html";
      } else if (label.includes("more")) {
        destination = "/pages/preferences.html";
      } else if (label.includes("reports")) {
        destination = "/pages/report.html";
      } else if (label.includes("map")) {
        destination = "/pages/map.html";
      }
    }

    if (destination) {
      event.preventDefault();
      window.location.assign(destination);
      return;
    }
  }

  // Leave all other real links alone.
  if (target.tagName === "A" &&
      target.getAttribute("href") !== "#") {
    return;
  }

  const current = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  const text = (target.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  let destination = null;

  if (
    current === "welcome" &&
    /log in|create account|continue as guest/.test(text)
  ) {
    destination = "/pages/map.html";
  } else if (
    current === "planner" &&
    /view routes|start navigation/.test(text)
  ) {
    destination = "/pages/route.html";
  } else if (/submit hazard report/.test(text)) {
    destination = "/pages/confirmation.html";
  } else if (/view report status/.test(text)) {
    destination = "/pages/confirmation.html";
  } else if (/analytical breakdown/.test(text)) {
    destination = "/pages/analytics.html";
  } else if (/report hazard at current pin/.test(text)) {
    destination = "/pages/report.html";
  } else if (/navigate here/.test(text)) {
    destination = "/pages/planner.html";
  }

  if (
    target.tagName === "BUTTON" &&
    text.includes("arrow_back")
  ) {
    const backRoutes = {
      planner: "/pages/map.html",
      route: "/pages/planner.html",
      report: "/pages/map.html",
      settings: "/pages/map.html",
      preferences: "/pages/map.html",
      heatmap: "/pages/map.html",
      analytics: "/pages/map.html",
      confirmation: "/pages/report.html"
    };

    destination = backRoutes[current] || "/pages/map.html";
  }

  if (destination) {
    event.preventDefault();
    window.location.assign(destination);
  }
});
