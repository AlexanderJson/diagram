import React from 'react';
import { Icons } from '../icons/Icons.jsx';
import { getNodeConfig } from '../data/nodeTypes.js';
import { isDataModel } from '../utils/dataFlow.js';

function complexTheme(type) {
    if (type === 'interface') return { backgroundColor: '#fce7f3', borderColor: '#f9a8d4', color: '#831843', sub: '<<interface>>' };
    if (type === 'classnode') return { backgroundColor: '#f3e8ff', borderColor: '#d8b4fe', color: '#581c87' };
    if (type === 'dbtable') return { backgroundColor: '#e0e7ff', borderColor: '#c7d2fe', color: '#312e81', sub: '<<table>>' };
    if (type === 'dto') return { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc', color: '#075985', sub: '<<dto>>' };
    if (type === 'record') return { backgroundColor: '#fce7f3', borderColor: '#f9a8d4', color: '#831843', sub: '<<record>>' };
    if (type === 'entity') return { backgroundColor: '#f3e8ff', borderColor: '#d8b4fe', color: '#581c87', sub: '<<entity>>' };
    return { backgroundColor: '#e0e7ff', borderColor: '#a5b4fc', color: '#3730a3', sub: '<<model>>' };
}

function fieldClass(role) {
    return role ? ` field-flow-${role}` : '';
}

export default function DiagramNode({
    node,
    isSelected,
    isConnectionSource,
    isDragging,
    selectedMethodId,
    fieldHighlights,
    onMouseDown,
    onResizeStart,
    onMethodSelect,
    onUpdate,
}) {
    const config = getNodeConfig(node.type);
    const Icon = config.icon;

    if (node.type === 'group') {
        return (
            <div className={`group-node ${isSelected ? 'group-selected' : ''}`} style={{ left: node.x, top: node.y, width: node.width || 350, height: node.height || 250 }}>
                <div className="group-header" onMouseDown={(event) => onMouseDown(event, node.id)}><Icons.SquareDashed /><span>{node.label}</span></div>
                <div className="resize-handle" onMouseDown={(event) => onResizeStart(event, node)}>
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px', stroke: 'currentColor', strokeWidth: 2 }}><path d="M10 16L16 10M4 16L16 4" strokeLinecap="round" /></svg>
                </div>
            </div>
        );
    }

    if (node.type === 'note') {
        return (
            <div className={`note-node ${isSelected ? 'node-selected' : ''}`} style={{ left: node.x, top: node.y }} onMouseDown={(event) => onMouseDown(event, node.id)}>
                <div className="note-header"><Icons.FileText /></div>
                <textarea className="note-textarea" value={node.description || ''} onChange={(event) => onUpdate(node.id, { description: event.target.value })} onMouseDown={(event) => event.stopPropagation()} placeholder="Skriv anteckning här..." />
            </div>
        );
    }

    const isFieldNode = node.type === 'dbtable' || isDataModel(node);
    const isClassType = node.type === 'classnode' || node.type === 'interface';
    const isComplexType = isFieldNode || isClassType;
    const theme = complexTheme(node.type);
    const baseClass = `node ${config.colorClass} ${isComplexType ? 'node-complex' : 'node-standard'} ${isSelected ? 'node-selected' : ''} ${isConnectionSource ? 'node-connecting-source' : ''}`;

    return (
        <div className={baseClass} style={{ left: node.x, top: node.y, transition: isDragging ? 'none' : 'box-shadow 0.2s, outline 0.2s' }} onMouseDown={(event) => onMouseDown(event, node.id)} onClick={(event) => event.stopPropagation()}>
            {node.type === 'endpoint' ? (
                <div className="endpoint-card">
                    <div className="endpoint-route"><span className={`http-method http-${(node.httpMethod || 'GET').toLowerCase()}`}>{node.httpMethod || 'GET'}</span><span>{node.route || '/resource'}</span></div>
                    <div className="endpoint-contract endpoint-input"><span>IN</span><strong>{node.requestModelId ? (node.requestType || 'Modell') : (node.requestType || '—')}</strong></div>
                    <div className="endpoint-contract endpoint-output"><span>OUT</span><strong>{node.successStatus || '200'} {node.responseModelId ? (node.responseType || 'Modell') : (node.responseType || '—')}</strong></div>
                </div>
            ) : isComplexType ? (
                <div className="complex-container">
                    <div className="complex-header" style={theme}>
                        {theme.sub && <span className="complex-sub">{theme.sub}</span>}
                        <div className="complex-header-row"><Icon /> <span>{node.label}</span></div>
                    </div>
                    {isFieldNode ? (
                        <div className="complex-body field-node-body">
                            {node.fields?.length ? node.fields.map((field) => {
                                const role = fieldHighlights?.get(`${node.id}:${field.id}`);
                                return <div key={field.id} className={`field-row${fieldClass(role)}`}>
                                    <span className="field-name">{field.name}</span>
                                    <span className="field-type">{field.type}</span>
                                    {node.type === 'dbtable' && field.classification && field.classification !== 'normal' && <span className={`field-classification ${field.classification}`}>{field.classification}</span>}
                                </div>;
                            }) : <div className="empty-fields">Inga fält</div>}
                        </div>
                    ) : (
                        <>
                            <div className="complex-body" style={{ backgroundColor: 'white' }}>
                                {node.properties?.length ? node.properties.map((property) => <div key={property.id} className="complex-row"><span className="member-visibility">{property.visibility}</span>{property.name}: <span className="member-type">{property.type}</span></div>) : <div className="empty-fields">Inga egenskaper</div>}
                            </div>
                            <div className="complex-divider" />
                            <div className="complex-body" style={{ backgroundColor: 'var(--slate-50)' }}>
                                {node.methods?.length ? node.methods.map((method) => <button key={method.id} className={`complex-row method-row ${selectedMethodId === method.id ? 'method-selected' : ''}`} onMouseDown={(event) => { event.stopPropagation(); onMethodSelect(node.id, method.id); }} onClick={(event) => event.stopPropagation()}><span className="member-visibility">{method.visibility}</span>{method.name}(): <span className="member-type">{method.type}</span>{(method.inputModelId || method.returnModelId) && <span className="method-flow-dot" title="Har datakontrakt" />}</button>) : <div className="empty-fields">Inga metoder</div>}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <><div className="node-icon-bg"><Icon /></div><div className="node-text-content"><div className="node-label">{node.label}</div>{node.description && <div className="node-desc" title={node.description}>{node.description}</div>}</div></>
            )}
            <div className="conn-point conn-top" /><div className="conn-point conn-bottom" /><div className="conn-point conn-left" /><div className="conn-point conn-right" />
        </div>
    );
}
