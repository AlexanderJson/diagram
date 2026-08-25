# ArchSketch

An interactive architecture and UML diagram editor. Drag components to the canvas,
connect them, edit their details, and export or import a diagram as JSON.

## Project structure

- `src/App.jsx` composes the application screens.
- `src/hooks/useDiagramEditor.js` owns diagram state and all editor interactions.
- `src/components/` contains small, reusable UI components.
- `src/icons/Icons.jsx` contains the inline SVG icon components.
- `src/data/nodeTypes.js` defines the reusable node palette.
- `src/utils/nodeLayout.js` centralizes node sizes and edge positions.
- `src/styles.css` contains the app's CSS.

## Run locally

The dependencies are already installed in this folder. From PowerShell, run:

```powershell
.\Start-ArchSketch.ps1
```

Then open the local address Vite prints (normally `http://127.0.0.1:5173`).

If you have Node.js and pnpm installed globally, you can instead use:

```powershell
pnpm install
pnpm dev
```

## Build for production

```powershell
node .\node_modules\vite\bin\vite.js build
```
