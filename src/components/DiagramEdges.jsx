import React from 'react';
import { getNodeCenter } from '../utils/nodeLayout.js';

export default function DiagramEdges({ nodes, edges, isConnecting, connectionStartNode, mouseWorldPos, selectedNodeId, onDelete }) {
    return (
        <svg className="svg-layer">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--slate-400)" />
                </marker>
                <marker id="arrowhead-highlighted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--blue-600)" />
                </marker>
            </defs>
            {edges.map((edge) => {
                const sourceNode = nodes.find((node) => node.id === edge.source);
                const targetNode = nodes.find((node) => node.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                const start = getNodeCenter(sourceNode);
                const end = getNodeCenter(targetNode);
                const isConnectedToSelection = selectedNodeId === edge.source || selectedNodeId === edge.target;
                const defaultStroke = isConnectedToSelection ? 'var(--blue-600)' : 'var(--slate-400)';

                return (
                    <g
                        key={edge.id}
                        className={isConnectedToSelection ? 'edge-active' : ''}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        onClick={(event) => { event.stopPropagation(); onDelete(edge.id); }}
                    >
                        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="15" />
                        <line
                            x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                            className="edge-line"
                            stroke={defaultStroke}
                            strokeWidth={isConnectedToSelection ? '3' : '2'}
                            markerEnd={isConnectedToSelection ? 'url(#arrowhead-highlighted)' : 'url(#arrowhead)'}
                            onMouseOver={(event) => event.target.setAttribute('stroke', 'var(--red-500)')}
                            onMouseOut={(event) => event.target.setAttribute('stroke', defaultStroke)}
                        />
                    </g>
                );
            })}
            {isConnecting && connectionStartNode && (() => {
                const sourceNode = nodes.find((node) => node.id === connectionStartNode);
                if (!sourceNode) return null;
                const start = getNodeCenter(sourceNode);
                return <line x1={start.x} y1={start.y} x2={mouseWorldPos.x} y2={mouseWorldPos.y} stroke="var(--amber-500)" strokeWidth="2" strokeDasharray="5,5" />;
            })()}
        </svg>
    );
}
