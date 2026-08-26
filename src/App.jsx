import React from 'react';
import DiagramCanvas from './components/DiagramCanvas.jsx';
import AppearancePanel from './components/AppearancePanel.jsx';
import DetailModal from './components/DetailModal.jsx';
import Dialog from './components/Dialog.jsx';
import FlowHealthPanel from './components/FlowHealthPanel.jsx';
import PropertiesPanel from './components/PropertiesPanel.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { useDiagramEditor } from './hooks/useDiagramEditor.js';
import { useAppearance } from './hooks/useAppearance.js';
import { getFlowWarnings } from './utils/dataFlow.js';

export default function App() {
    const editor = useDiagramEditor();
    const appearance = useAppearance();
    const selectedNode = editor.nodes.find((node) => node.id === editor.selectedNodeId);
    const detailNode = editor.nodes.find((node) => node.id === editor.detailModalNodeId);
    const flowWarnings = getFlowWarnings(editor.nodes, editor.edges, editor.dataMappings);

    return (
        <div className="app-container">
            <Sidebar
                onDragStart={editor.handleSidebarDragStart}
                onCreateCustomNode={editor.createCustomNode}
                onAddTemplate={editor.addTemplate}
            />
            <main className="main-content">
                <Topbar
                    isConnecting={editor.isConnecting}
                    isCopied={editor.isCopied}
                    onShare={editor.share}
                    onImport={editor.importJson}
                    onExport={editor.exportJson}
                    onClear={editor.clearDiagram}
                    flowWarningCount={flowWarnings.length}
                    onToggleFlowHealth={() => editor.setIsFlowHealthOpen((open) => !open)}
                    onToggleAppearance={() => appearance.setIsAppearanceOpen((open) => !open)}
                />
                <DiagramCanvas
                    wrapperRef={editor.wrapperRef}
                    nodes={editor.nodes}
                    edges={editor.edges}
                    dataMappings={editor.dataMappings}
                    selectedNodeId={editor.selectedNodeId}
                    selectedMethodId={editor.selectedMethodId}
                    connectionStartNode={editor.connectionStartNode}
                    isConnecting={editor.isConnecting}
                    isPanning={editor.isPanning}
                    pan={editor.pan}
                    zoom={editor.zoom}
                    mouseWorldPos={editor.mouseWorldPos}
                    dragInfo={editor.dragInfo}
                    onDrop={editor.handleDrop}
                    onMouseDown={editor.handleCanvasMouseDown}
                    onMouseMove={editor.handleMouseMove}
                    onMouseUp={editor.handleMouseUp}
                    onNodeMouseDown={editor.handleNodeMouseDown}
                    onResizeStart={editor.handleResizeStart}
                    onUpdateNode={editor.updateNode}
                    onSelectMethod={editor.selectMethod}
                    onDeleteEdge={editor.deleteEdge}
                    onCanvasClick={editor.handleCanvasClick}
                    onZoomIn={editor.zoomIn}
                    onZoomOut={editor.zoomOut}
                    onFit={editor.fitView}
                    onReset={editor.resetView}
                />
                <PropertiesPanel
                    node={selectedNode}
                    nodes={editor.nodes}
                    dataMappings={editor.dataMappings}
                    updateNode={editor.updateNode}
                    addDataMapping={editor.addDataMapping}
                    updateDataMapping={editor.updateDataMapping}
                    removeDataMapping={editor.removeDataMapping}
                    deselectNode={() => editor.setSelectedNodeId(null)}
                    deleteNode={editor.deleteNode}
                    openDetailModal={editor.setDetailModalNodeId}
                    onSelectNode={editor.selectNode}
                />
                {editor.isFlowHealthOpen && <FlowHealthPanel warnings={flowWarnings} onClose={() => editor.setIsFlowHealthOpen(false)} onSelectNode={editor.selectNode} />}
                {appearance.isAppearanceOpen && <AppearancePanel appearance={appearance.appearance} onClose={() => appearance.setIsAppearanceOpen(false)} onSetMode={appearance.setMode} onSetColor={appearance.setColor} onReset={appearance.resetAppearance} />}
            </main>
            <DetailModal
                node={detailNode}
                onClose={() => editor.setDetailModalNodeId(null)}
                updateNode={editor.updateNode}
            />
            <Dialog dialog={editor.dialog} onClose={editor.closeDialog} />
        </div>
    );
}
