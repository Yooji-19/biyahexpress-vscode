# BiyahExpress | Visual Studio Code project

This is a multi-page Vite version of the 10 HTML screens exported from Google Stitch. The original layouts are retained, with a **Screens** menu and basic navigation wired between pages.

## Run in Visual Studio Code

1. Unzip this folder and open **biyahexpress-vscode** in VS Code (**File → Open Folder**).
2. Open **Terminal → New Terminal**.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the localhost address printed in the terminal (usually **http://localhost:5173**).

## Commands

- `npm run dev` starts the local development site.
- `npm run build` creates the production-ready static output in `dist/`.
- `npm run preview` previews the built site.

## Files

- `pages/*.html`: all ten original Stitch screens, with shared navigation imported.
- `src/navigation.js`: screen switcher and demo routing.
- `reference-screens/`: non-empty screenshot previews supplied in the ZIP.
- `vite.config.js`: multi-page build configuration.

## Important

This is a **front-end prototype**. The source uses the Tailwind CDN, Google Fonts and remote decorative map/image assets, so **internet access is needed** for all styling/assets to load as designed. The UI displays sample map/report information; it does not yet provide real accounts, hazard submissions, GPS navigation, live transit status, data storage, or a backend. Controls not connected in `src/navigation.js` remain mockup controls.
