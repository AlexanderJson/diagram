import React from 'react';
import DiagramCanvas from './components/DiagramCanvas.jsx';
import DetailModal from './components/DetailModal.jsx';
import Dialog from './components/Dialog.jsx';
import PropertiesPanel from './components/PropertiesPanel.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { useDiagramEditor } from './hooks/useDiagramEditor.js';

export default function App() {
    const editor = useDiagramEditor();
    const selectedNode = editor.nodes.find((node) => node.id === editor.selectedNodeId);
    const detailNode = editor.nodes.find((node) => node.id === editor.detailModalNodeId);

    return (
        <div className="app-container">
            <Sidebar
                onDragStart={editor.handleSidebarDragStart}
                onCreateCustomNode={editor.createCustomNode}
            />
            <main className="main-content">
                <Topbar
                    isConnecting={editor.isConnecting}
                    isCopied={editor.isCopied}
                    onShare={editor.share}
                    onImport={editor.importJson}
                    onExport={editor.exportJson}
                    onClear={editor.clearDiagram}
                />
                <DiagramCanvas
                    wrapperRef={editor.wrapperRef}
                    nodes={editor.nodes}
                    edges={editor.edges}
                    selectedNodeId={editor.selectedNodeId}
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
                    onDeleteEdge={editor.deleteEdge}
                    onCanvasClick={editor.handleCanvasClick}
                    onZoomIn={editor.zoomIn}
                    onZoomOut={editor.zoomOut}
                    onFit={editor.fitView}
                    onReset={editor.resetView}
                />
                <PropertiesPanel
                    node={selectedNode}
                    updateNode={editor.updateNode}
                    deselectNode={() => editor.setSelectedNodeId(null)}
                    deleteNode={editor.deleteNode}
                    openDetailModal={editor.setDetailModalNodeId}
                />
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
