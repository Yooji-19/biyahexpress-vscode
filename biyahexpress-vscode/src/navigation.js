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

// Visible screen switcher: every exported Stitch page stays accessible.
const switcher = document.createElement('div');
switcher.id = 'prototype-navigation';
switcher.innerHTML = `<button type="button" id="prototype-toggle" aria-label="Open screen menu" aria-expanded="false">☰ Screens</button><nav id="prototype-menu" aria-label="Prototype pages" hidden>${pages.map(([id, label]) => `<a ${id === current ? 'aria-current="page"' : ''} href="/pages/${id}.html">${label}</a>`).join('')}</nav>`;
document.body.append(switcher);
const css = document.createElement('style');
css.textContent = `#prototype-navigation{position:fixed;bottom:78px;right:12px;z-index:2147483640;font:13px system-ui,sans-serif;color:#172554}#prototype-toggle{background:#172554;color:white;border:1px solid #93c5fd;border-radius:12px;padding:10px 12px;box-shadow:0 4px 18px #0004;cursor:pointer}#prototype-menu{position:absolute;right:0;bottom:48px;max-height:65vh;overflow:auto;width:240px;background:white;border:1px solid #ddd;border-radius:12px;box-shadow:0 10px 32px #0003;padding:7px}#prototype-menu[hidden]{display:none}#prototype-menu a{display:block;padding:9px 10px;color:#172554;text-decoration:none;border-radius:8px}#prototype-menu a:hover,#prototype-menu a[aria-current="page"]{background:#dbeafe}`;
document.head.append(css);
const toggle = document.getElementById('prototype-toggle');
const menu = document.getElementById('prototype-menu');
toggle.addEventListener('click', () => { menu.hidden = !menu.hidden; toggle.setAttribute('aria-expanded', String(!menu.hidden)); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); } });

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
