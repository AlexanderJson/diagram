import React from 'react';
import { Icons } from '../icons/Icons.jsx';
import { getNodeConfig } from '../data/nodeTypes.js';

export default function DiagramNode({
    node,
    isSelected,
    isConnectionSource,
    isDragging,
    onMouseDown,
    onResizeStart,
    onUpdate,
}) {
    const config = getNodeConfig(node.type);
    const Icon = config.icon;

    if (node.type === 'group') {
        return (
            <div
                className={`group-node ${isSelected ? 'group-selected' : ''}`}
                style={{ left: node.x, top: node.y, width: node.width || 350, height: node.height || 250 }}
            >
                <div className="group-header" onMouseDown={(event) => onMouseDown(event, node.id)}>
                    <Icons.SquareDashed />
                    <span>{node.label}</span>
                </div>
                <div className="resize-handle" onMouseDown={(event) => onResizeStart(event, node)}>
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px', stroke: 'currentColor', strokeWidth: 2 }}>
                        <path d="M10 16L16 10M4 16L16 4" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        );
    }

    if (node.type === 'note') {
        return (
            <div
                className={`note-node ${isSelected ? 'node-selected' : ''}`}
                style={{ left: node.x, top: node.y }}
                onMouseDown={(event) => onMouseDown(event, node.id)}
            >
                <div className="note-header"><Icons.FileText /></div>
                <textarea
                    className="note-textarea"
                    value={node.description || ''}
                    onChange={(event) => onUpdate(node.id, { description: event.target.value })}
                    onMouseDown={(event) => event.stopPropagation()}
                    placeholder="Skriv anteckning här..."
                />
            </div>
        );
    }

    const isComplexType = ['classnode', 'interface', 'dbtable'].includes(node.type);
    return (
        <div
            className={`node ${config.colorClass} ${isComplexType ? 'node-complex' : 'node-standard'} ${isSelected ? 'node-selected' : ''} ${isConnectionSource ? 'node-connecting-source' : ''}`}
            style={{
                left: node.x,
                top: node.y,
                transition: isDragging ? 'none' : 'box-shadow 0.2s, outline 0.2s',
            }}
            onMouseDown={(event) => onMouseDown(event, node.id)}
            onClick={(event) => event.stopPropagation()}
        >
            {isComplexType ? (
                <div className="complex-container">
                    <div
                        className="complex-header"
                        style={{
                            backgroundColor: node.type === 'interface' ? '#fce7f3' : node.type === 'classnode' ? '#f3e8ff' : '#e0e7ff',
                            borderColor: node.type === 'interface' ? '#f9a8d4' : node.type === 'classnode' ? '#d8b4fe' : '#c7d2fe',
                            color: node.type === 'interface' ? '#831843' : node.type === 'classnode' ? '#581c87' : '#312e81',
                        }}
                    >
                        {node.type === 'interface' && <span className="complex-sub">&lt;&lt;interface&gt;&gt;</span>}
                        <div className="complex-header-row"><Icon /> <span>{node.label}</span></div>
                    </div>
                    {node.type === 'dbtable' ? (
                        <div className="complex-body">
                            {node.fields?.length ? (
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {node.fields.map((field) => (
                                            <tr key={field.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                                <td style={{ padding: '2px 8px 2px 0', fontWeight: 600 }}>{field.name}</td>
                                                <td style={{ padding: '2px 0', color: 'var(--slate-500)' }}>{field.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div style={{ textAlign: 'center', color: 'var(--slate-400)', fontStyle: 'italic' }}>Inga kolumner</div>}
                        </div>
                    ) : (
                        <>
                            <div className="complex-body" style={{ backgroundColor: 'white' }}>
                                {node.properties?.length ? node.properties.map((property) => (
                                    <div key={property.id} className="complex-row">
                                        <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{property.visibility}</span>
                                        {property.name}: <span style={{ color: 'var(--slate-500)' }}>{property.type}</span>
                                    </div>
                                )) : <div style={{ textAlign: 'center', color: 'var(--slate-300)', fontStyle: 'italic' }}>Inga egenskaper</div>}
                            </div>
                            <div className="complex-divider" />
                            <div className="complex-body" style={{ backgroundColor: 'var(--slate-50)' }}>
                                {node.methods?.length ? node.methods.map((method) => (
                                    <div key={method.id} className="complex-row">
                                        <span style={{ fontWeight: 'bold', color: 'var(--slate-600)', marginRight: '4px' }}>{method.visibility}</span>
                                        {method.name}(): <span style={{ color: 'var(--slate-500)' }}>{method.type}</span>
                                    </div>
                                )) : <div style={{ textAlign: 'center', color: 'var(--slate-300)', fontStyle: 'italic' }}>Inga metoder</div>}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="node-icon-bg"><Icon /></div>
                    <div className="node-text-content">
                        <div className="node-label">{node.label}</div>
                        {node.description && <div className="node-desc" title={node.description}>{node.description}</div>}
                    </div>
                </>
            )}
            <div className="conn-point conn-top" />
            <div className="conn-point conn-bottom" />
            <div className="conn-point conn-left" />
            <div className="conn-point conn-right" />
        </div>
    );
}
