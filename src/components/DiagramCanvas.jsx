import React from 'react';
import DiagramEdges from './DiagramEdges.jsx';
import DiagramNode from './DiagramNode.jsx';
import ZoomControls from './ZoomControls.jsx';

export default function DiagramCanvas({
    wrapperRef,
    nodes,
    edges,
    selectedNodeId,
    connectionStartNode,
    isConnecting,
    isPanning,
    pan,
    zoom,
    mouseWorldPos,
    dragInfo,
    onDrop,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onNodeMouseDown,
    onResizeStart,
    onUpdateNode,
    onDeleteEdge,
    onCanvasClick,
    onZoomIn,
    onZoomOut,
    onFit,
    onReset,
}) {
    return (
        <div
            ref={wrapperRef}
            className="canvas-wrapper"
            style={{
                cursor: isPanning ? 'grabbing' : 'grab',
                backgroundImage: 'radial-gradient(var(--slate-300) 1.5px, transparent 1.5px)',
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
            onDrop={onDrop}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onContextMenu={(event) => event.preventDefault()}
            onClick={onCanvasClick}
        >
            <div id="canvas-world" className="canvas-world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                <DiagramEdges
                    nodes={nodes}
                    edges={edges}
                    isConnecting={isConnecting}
                    connectionStartNode={connectionStartNode}
                    mouseWorldPos={mouseWorldPos}
                    selectedNodeId={selectedNodeId}
                    onDelete={onDeleteEdge}
                />
                {[...nodes]
                    .sort((a, b) => (a.type === 'group' ? -1 : 0) - (b.type === 'group' ? -1 : 0))
                    .map((node) => (
                        <DiagramNode
                            key={node.id}
                            node={node}
                            isSelected={selectedNodeId === node.id}
                            isConnectionSource={connectionStartNode === node.id}
                            isDragging={dragInfo.isDragging && dragInfo.nodeId === node.id}
                            onMouseDown={onNodeMouseDown}
                            onResizeStart={onResizeStart}
                            onUpdate={onUpdateNode}
                        />
                    ))}
            </div>
            <ZoomControls zoom={zoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onFit={onFit} onReset={onReset} />
        </div>
    );
}
