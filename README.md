# ArchSketch

An interactive architecture and UML diagram editor. Drag components to the canvas,
connect them, edit their details, and export or import a diagram as JSON.

## Architecture planner

Build diagrams node by node with API, CQRS, domain, infrastructure, and testing
building blocks. Select a node to highlight its connected data flow. Optional
quick-start templates add an editable example beside your current diagram; they
never replace your existing work.

## Field-level data flow

DTOs, Records, Entities, and Models can contain editable fields. Map a model
field to a database-table column in its **Egenskaper** panel, then select the
model to see temporary field-level flow lines:

- Orange: expected input / write flow.
- Blue: returned output / read flow.
- Purple: a mapping marked as both.

Endpoints can reference one input and one output model. Classes and interfaces
can do the same per method; click a method on its diagram node to inspect that
method's flow. The **Flow Health** button shows planning warnings for sensitive
fields returned by endpoints, missing contracts, direct endpoint-to-database
links, and unmapped persistence-backed fields. These are design signals, not a
security audit.

Exports now include `dataMappings` in addition to nodes and ordinary edges.
Older exports without that property still import normally.

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
