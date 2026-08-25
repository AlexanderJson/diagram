import React from 'react';
import { Icons } from '../icons/Icons.jsx';

export default function PropertiesPanel({ node, updateNode, deselectNode, deleteNode, openDetailModal }) {
    if (!node) return null;
    if (node.type === 'note') return null; // Notes are edited inline

    // Helper methods to update deeply nested state.
    // React state should be treated as immutable. Instead of modifying the array directly (like `list.add()`),
    // we create a new array with the new item spread `[...existing, newItem]`.
    const addField = () => {
        const currentFields = node.fields || [];
        updateNode(node.id, { fields: [...currentFields, { id: Date.now().toString(), name: 'ny_kolumn', type: 'varchar' }] });
    };

    const updateField = (fieldId, key, value) => {
        const updatedFields = (node.fields || []).map(f => f.id === fieldId ? { ...f, [key]: value } : f);
        updateNode(node.id, { fields: updatedFields });
    };

    const removeField = (fieldId) => {
        const updatedFields = (node.fields || []).filter(f => f.id !== fieldId);
        updateNode(node.id, { fields: updatedFields });
    };

    // Class Properties
    const addClassProperty = () => {
        const props = node.properties || [];
        updateNode(node.id, { properties: [...props, { id: Date.now().toString(), visibility: '+', name: 'nyttFält', type: 'string' }] });
    };
    const updateClassProperty = (propId, key, value) => {
        const updatedProps = (node.properties || []).map(p => p.id === propId ? { ...p, [key]: value } : p);
        updateNode(node.id, { properties: updatedProps });
    };
    const removeClassProperty = (propId) => {
        updateNode(node.id, { properties: (node.properties || []).filter(p => p.id !== propId) });
    };

    // Class Methods
    const addClassMethod = () => {
        const methods = node.methods || [];
        updateNode(node.id, { methods: [...methods, { id: Date.now().toString(), visibility: '+', name: 'NyMetod', type: 'void' }] });
    };
    const updateClassMethod = (methodId, key, value) => {
        const updatedMethods = (node.methods || []).map(m => m.id === methodId ? { ...m, [key]: value } : m);
        updateNode(node.id, { methods: updatedMethods });
    };
    const removeClassMethod = (methodId) => {
        updateNode(node.id, { methods: (node.methods || []).filter(m => m.id !== methodId) });
    };

    const isClassType = node.type === 'classnode' || node.type === 'interface';

    return (
        <div className="properties-panel">
            <div className="panel-header">
                <h3><Icons.Settings /> Egenskaper</h3>
                <button className="icon-btn-small" onClick={deselectNode}>
                    <Icons.X />
                </button>
            </div>
            
            <div className="panel-body">
                <div className="form-group-small">
                    <label>Namn / Etikett</label>
                    <input
                        type="text"
                        value={node.label || ''}
                        onChange={(e) => updateNode(node.id, { label: e.target.value })}
                    />
                </div>
                <div className="form-group-small">
                    <label>Kort Beskrivning</label>
                    <textarea
                        value={node.description || ''}
                        onChange={(e) => updateNode(node.id, { description: e.target.value })}
                        placeholder={node.type === 'dbtable' ? "Tabellbeskrivning..." : "T.ex. IP, instans..."}
                    />
                </div>

                <button className="btn-secondary full-width" onClick={() => openDetailModal(node.id)}>
                    <Icons.Maximize2 /> Öppna detaljer / Kod
                </button>

                <div className="panel-scroll-area">
                    {/* DB Table Specifics */}
                    {node.type === 'dbtable' && (
                    <div className="section-divider">
                        <label>Tabellkolumner</label>
                        <div className="dynamic-list">
                            {(node.fields || []).map((field) => (
                                <div key={field.id} className="dynamic-row">
                                    <input 
                                        type="text" 
                                        value={field.name}
                                        onChange={(e) => updateField(field.id, 'name', e.target.value)}
                                        placeholder="namn"
                                        style={{width: '45%'}}
                                    />
                                    <input 
                                        type="text" 
                                        value={field.type}
                                        onChange={(e) => updateField(field.id, 'type', e.target.value)}
                                        placeholder="typ"
                                        style={{flex: 1}}
                                    />
                                    <button className="icon-btn-danger" onClick={() => removeField(field.id)}><Icons.X /></button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-ghost full-width" onClick={addField}>
                            <Icons.Plus /> Lägg till kolumn
                        </button>
                    </div>
                    )}

                    {/* Class Specifics */}
                    {isClassType && (
                    <>
                        <div className="section-divider">
                            <label>Egenskaper (Fält)</label>
                            <div className="dynamic-list">
                                {(node.properties || []).map((p) => (
                                    <div key={p.id} className="dynamic-row">
                                        <select 
                                            value={p.visibility} onChange={(e) => updateClassProperty(p.id, 'visibility', e.target.value)}
                                            style={{width: '40px'}}
                                        >
                                            <option value="+">+</option>
                                            <option value="-">-</option>
                                            <option value="#">#</option>
                                        </select>
                                        <input 
                                            type="text" value={p.name} onChange={(e) => updateClassProperty(p.id, 'name', e.target.value)}
                                            placeholder="Namn" style={{width: '40%'}}
                                        />
                                        <span className="colon-sep">:</span>
                                        <input 
                                            type="text" value={p.type} onChange={(e) => updateClassProperty(p.id, 'type', e.target.value)}
                                            placeholder="Typ" style={{flex: 1}}
                                        />
                                        <button className="icon-btn-danger" onClick={() => removeClassProperty(p.id)}><Icons.X /></button>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-ghost full-width" onClick={addClassProperty}>
                                <Icons.Plus /> Lägg till egenskap
                            </button>
                        </div>

                        <div className="section-divider">
                            <label>Metoder</label>
                            <div className="dynamic-list">
                                {(node.methods || []).map((m) => (
                                    <div key={m.id} className="dynamic-row">
                                        <select 
                                            value={m.visibility} onChange={(e) => updateClassMethod(m.id, 'visibility', e.target.value)}
                                            style={{width: '40px'}}
                                        >
                                            <option value="+">+</option>
                                            <option value="-">-</option>
                                            <option value="#">#</option>
                                        </select>
                                        <input 
                                            type="text" value={m.name} onChange={(e) => updateClassMethod(m.id, 'name', e.target.value)}
                                            placeholder="Namn()" style={{width: '40%'}}
                                        />
                                        <span className="colon-sep">:</span>
                                        <input 
                                            type="text" value={m.type} onChange={(e) => updateClassMethod(m.id, 'type', e.target.value)}
                                            placeholder="Retur" style={{flex: 1}}
                                        />
                                        <button className="icon-btn-danger" onClick={() => removeClassMethod(m.id)}><Icons.X /></button>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-ghost full-width" onClick={addClassMethod}>
                                <Icons.Plus /> Lägg till metod
                            </button>
                        </div>
                    </>
                    )}
                </div>
                
                <div className="panel-footer">
                    <button className="btn-danger" onClick={() => deleteNode(node.id)}>
                        <Icons.Trash2 /> Ta bort nod
                    </button>
                </div>
            </div>
        </div>
    );
}
