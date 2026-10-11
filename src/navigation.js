// Lightweight navigation across the original Stitch HTML designs.
// The UI is a prototype, not yet connected to a database or live transport API.
const pages = [
  ['welcome', 'Welcome / Login'],
  ['preferences', 'Accessibility Preferences'],
  ['dashboard', 'Home Dashboard'],
  ['planner', 'Route Planner'],
  ['route', 'Route Details'],
  ['report', 'Report Hazard'],
  ['confirmation', 'Report Confirmation'],
  ['map', 'Accessibility Map'],
  ['heatmap', 'Hazard Heatmap'],
  ['analytics', 'Hazard Analytics'],
];
const current = location.pathname.split('/').pop().replace('.html', '');
const go = (page) => { location.href = `/pages/${page}.html`; };


// Wire the core demonstrable flow without changing the visual designs.
document.addEventListener('click', (event) => {
  const target = event.target.closest('a, button');
  if (!target || target.closest('#prototype-navigation')) return;
  const text = (target.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const href = target.getAttribute('href');
  let destination = null;
  if (/log in|create account|continue as guest/.test(text) && current === 'welcome') destination = 'preferences';
  else if (/save preferences/.test(text)) destination = 'dashboard';
  else if (/view routes|start navigation/.test(text) && current === 'planner') destination = 'route';
  else if (/submit hazard report/.test(text)) destination = 'confirmation';
  else if (/back to home dashboard/.test(text)) destination = 'dashboard';
  else if (/view report status/.test(text)) destination = 'confirmation';
  else if (/analytical breakdown/.test(text)) destination = 'analytics';
  else if (/report hazard at current pin/.test(text)) destination = 'report';
  else if (/navigate here/.test(text)) destination = 'planner';
  else if (target.tagName === 'A' && href === '#') {
    if (/home/.test(text)) destination = 'dashboard';
    else if (/map/.test(text)) destination = 'map';
    else if (/reports/.test(text)) destination = 'report';
    else if (/more/.test(text)) destination = 'preferences';
  }
  if (/arrow_back/.test(text) && target.tagName === 'BUTTON') {
    destination = ({ planner: 'dashboard', route: 'planner', report: 'dashboard', heatmap: 'map' })[current] || null;
  }
  if (destination) { event.preventDefault(); go(destination); }
});
