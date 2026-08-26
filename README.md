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
field to a database-table column in its **Egenskaper** panel. You can select
several database tables and add several explicit field pairs for each one.
Selecting the
model highlights only the participating fields, keeping the diagram uncluttered:

- Orange: expected input / write fields.
- Blue: returned output / read fields.
- Purple: a field mapping marked as both.

Ordinary architecture arrows remain the only lines between modules and still
highlight when a connected node is selected.

Creating fields manually is optional: in a table mapping row, leave
**Modellfält** on **Skapa från kolumn**, choose a database column, and save. The
model receives a persistence-backed field using that column's name and type.

Use **Utseende** in the top bar to choose the warm dark theme and adjust the
three field-glow colors. These appearance preferences are saved locally in your
browser, not in the diagram export.

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
