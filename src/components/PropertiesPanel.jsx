import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons/Icons.jsx';
import { createDataField, findSuggestedMappings, isDataModel } from '../utils/dataFlow.js';

const emptyMapping = { modelFieldId: '', tableNodeId: '', tableFieldId: '', direction: 'both' };

function ModelSelect({ value, models, onChange, placeholder = 'Ingen modell' }) {
    return <select value={value || ''} onChange={(event) => onChange(event.target.value || null)}><option value="">{placeholder}</option>{models.map((model) => <option key={model.id} value={model.id}>{model.label}</option>)}</select>;
}

export default function PropertiesPanel({
    node,
    nodes,
    dataMappings,
    updateNode,
    addDataMapping,
    updateDataMapping,
    removeDataMapping,
    deselectNode,
    deleteNode,
    openDetailModal,
    onSelectNode,
}) {
    const [newMapping, setNewMapping] = useState(emptyMapping);
    const modelNodes = useMemo(() => nodes.filter(isDataModel), [nodes]);
    const tableNodes = useMemo(() => nodes.filter((item) => item.type === 'dbtable'), [nodes]);
    useEffect(() => {
        if (node) setNewMapping({ modelFieldId: node.fields?.[0]?.id || '', tableNodeId: '', tableFieldId: '', direction: 'both' });
    }, [node?.id]);
    if (!node || node.type === 'note') return null;

    const isFieldNode = node.type === 'dbtable' || isDataModel(node);
    const isClassType = node.type === 'classnode' || node.type === 'interface';
    const currentMappings = dataMappings.filter((mapping) => mapping.modelNodeId === node.id);
    const suggestions = findSuggestedMappings(node, nodes, dataMappings);
    const selectedTable = tableNodes.find((table) => table.id === newMapping.tableNodeId);

    const addField = () => updateNode(node.id, { fields: [...(node.fields || []), createDataField()] });
    const updateField = (fieldId, key, value) => updateNode(node.id, { fields: (node.fields || []).map((field) => field.id === fieldId ? { ...field, [key]: value } : field) });
    const removeField = (fieldId) => updateNode(node.id, { fields: (node.fields || []).filter((field) => field.id !== fieldId) });
    const addClassProperty = () => updateNode(node.id, { properties: [...(node.properties || []), { id: `${Date.now()}`, visibility: '+', name: 'nyttFält', type: 'string' }] });
    const updateClassProperty = (propertyId, key, value) => updateNode(node.id, { properties: (node.properties || []).map((property) => property.id === propertyId ? { ...property, [key]: value } : property) });
    const removeClassProperty = (propertyId) => updateNode(node.id, { properties: (node.properties || []).filter((property) => property.id !== propertyId) });
    const addClassMethod = () => updateNode(node.id, { methods: [...(node.methods || []), { id: `${Date.now()}`, visibility: '+', name: 'NyMetod', type: 'void', inputModelId: null, returnModelId: null }] });
    const updateClassMethod = (methodId, key, value) => updateNode(node.id, { methods: (node.methods || []).map((method) => method.id === methodId ? { ...method, [key]: value } : method) });
    const removeClassMethod = (methodId) => updateNode(node.id, { methods: (node.methods || []).filter((method) => method.id !== methodId) });
    const linkedUses = [
        ...nodes.filter((item) => item.type === 'endpoint' && (item.requestModelId === node.id || item.responseModelId === node.id)).map((item) => ({ node: item, label: `Endpoint · ${item.label}` })),
        ...nodes.filter((item) => isClassTypeNode(item)).flatMap((item) => (item.methods || []).filter((method) => method.inputModelId === node.id || method.returnModelId === node.id).map((method) => ({ node: item, label: `${item.label}.${method.name}()` }))),
    ];

    return (
        <div className="properties-panel">
            <div className="panel-header"><h3><Icons.Settings /> Egenskaper</h3><button className="icon-btn-small" onClick={deselectNode}><Icons.X /></button></div>
            <div className="panel-body">
                <div className="form-group-small"><label>Namn / Etikett</label><input type="text" value={node.label || ''} onChange={(event) => updateNode(node.id, { label: event.target.value })} /></div>
                <div className="form-group-small"><label>Kort Beskrivning</label><textarea value={node.description || ''} onChange={(event) => updateNode(node.id, { description: event.target.value })} placeholder="Beskriv ansvar eller användning..." /></div>
                <button className="btn-secondary full-width" onClick={() => openDetailModal(node.id)}><Icons.Maximize2 /> Öppna detaljer / Kod</button>

                <div className="panel-scroll-area">
                    {node.type === 'endpoint' && <EndpointEditor node={node} models={modelNodes} updateNode={updateNode} />}

                    {isFieldNode && <div className="section-divider">
                        <label>{node.type === 'dbtable' ? 'Tabellkolumner' : 'API / Data-fält'}</label>
                        <div className="dynamic-list">
                            {(node.fields || []).map((field) => <div key={field.id} className="field-editor-row">
                                <div className="dynamic-row"><input type="text" value={field.name} onChange={(event) => updateField(field.id, 'name', event.target.value)} placeholder="namn" style={{ width: '48%' }} /><input type="text" value={field.type} onChange={(event) => updateField(field.id, 'type', event.target.value)} placeholder="typ" style={{ flex: 1 }} /><button className="icon-btn-danger" onClick={() => removeField(field.id)}><Icons.X /></button></div>
                                <div className="field-options">
                                    {node.type === 'dbtable' ? <><span>Klassning</span><select value={field.classification || 'normal'} onChange={(event) => updateField(field.id, 'classification', event.target.value)}><option value="normal">Normal</option><option value="sensitive">Sensitive</option><option value="secret">Secret</option></select></> : <label className="check-label"><input type="checkbox" checked={Boolean(field.persistenceBacked)} onChange={(event) => updateField(field.id, 'persistenceBacked', event.target.checked)} /> Persistence-backed</label>}
                                </div>
                            </div>)}
                        </div>
                        <button className="btn-ghost full-width" onClick={addField}><Icons.Plus /> Lägg till fält</button>
                    </div>}

                    {isDataModel(node) && <DataMappingEditor node={node} tables={tableNodes} mappings={currentMappings} suggestions={suggestions} newMapping={newMapping} selectedTable={selectedTable} setNewMapping={setNewMapping} addDataMapping={addDataMapping} updateDataMapping={updateDataMapping} removeDataMapping={removeDataMapping} />}

                    {isDataModel(node) && <div className="section-divider"><label>Används av</label>{linkedUses.length ? <div className="linked-use-list">{linkedUses.map((use, index) => <button key={`${use.node.id}-${index}`} className="linked-use" onClick={() => onSelectNode(use.node.id)}>{use.label}</button>)}</div> : <div className="hint-text">Inga Endpoints eller metoder refererar till denna modell.</div>}</div>}

                    {isClassType && <ClassEditor node={node} models={modelNodes} addProperty={addClassProperty} updateProperty={updateClassProperty} removeProperty={removeClassProperty} addMethod={addClassMethod} updateMethod={updateClassMethod} removeMethod={removeClassMethod} />}
                </div>
                <div className="panel-footer"><button className="btn-danger" onClick={() => deleteNode(node.id)}><Icons.Trash2 /> Ta bort nod</button></div>
            </div>
        </div>
    );
}

function isClassTypeNode(node) { return node.type === 'classnode' || node.type === 'interface'; }

function EndpointEditor({ node, models, updateNode }) {
    const chooseModel = (key, typeKey, modelId) => {
        const model = models.find((item) => item.id === modelId);
        updateNode(node.id, { [key]: modelId, [typeKey]: model ? model.label : '' });
    };
    return <div className="section-divider endpoint-editor"><label>API / Data-kontrakt</label>
        <div className="endpoint-editor-grid"><select value={node.httpMethod || 'GET'} onChange={(event) => updateNode(node.id, { httpMethod: event.target.value })}>{['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => <option key={method}>{method}</option>)}</select><input value={node.route || ''} onChange={(event) => updateNode(node.id, { route: event.target.value })} placeholder="/customers/{id}" /></div>
        <div className="contract-editor input"><span>Förväntad input</span><input value={node.requestType || ''} onChange={(event) => updateNode(node.id, { requestType: event.target.value })} placeholder="CreateCustomerDto" /><ModelSelect value={node.requestModelId} models={models} onChange={(modelId) => chooseModel('requestModelId', 'requestType', modelId)} /></div>
        <div className="contract-editor output"><span>Returnerat svar</span><div className="endpoint-editor-grid"><input value={node.successStatus || ''} onChange={(event) => updateNode(node.id, { successStatus: event.target.value })} placeholder="200" /><input value={node.responseType || ''} onChange={(event) => updateNode(node.id, { responseType: event.target.value })} placeholder="CustomerDto" /></div><ModelSelect value={node.responseModelId} models={models} onChange={(modelId) => chooseModel('responseModelId', 'responseType', modelId)} /></div>
    </div>;
}

function DataMappingEditor({ node, tables, mappings, suggestions, newMapping, selectedTable, setNewMapping, addDataMapping, updateDataMapping, removeDataMapping }) {
    const tableFields = selectedTable?.fields || [];
    const add = () => {
        addDataMapping({ modelNodeId: node.id, ...newMapping });
        setNewMapping((current) => ({ ...current, tableFieldId: '' }));
    };
    return <div className="section-divider"><label>Databas-mappningar</label>
        {suggestions.length > 0 && <div className="mapping-suggestions"><span>Samma namn hittades:</span>{suggestions.map((suggestion) => <button key={`${suggestion.modelField.id}-${suggestion.tableNode.id}`} className="suggestion-btn" onClick={() => addDataMapping({ modelNodeId: node.id, modelFieldId: suggestion.modelField.id, tableNodeId: suggestion.tableNode.id, tableFieldId: suggestion.tableField.id, direction: 'both' })}>Koppla {suggestion.modelField.name} → {suggestion.tableNode.label}.{suggestion.tableField.name}</button>)}</div>}
        <div className="mapping-create">
            <select value={newMapping.modelFieldId} onChange={(event) => setNewMapping((current) => ({ ...current, modelFieldId: event.target.value }))}><option value="">Modellfält</option>{(node.fields || []).map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select>
            <select value={newMapping.tableNodeId} onChange={(event) => setNewMapping((current) => ({ ...current, tableNodeId: event.target.value, tableFieldId: '' }))}><option value="">Databastabell</option>{tables.map((table) => <option key={table.id} value={table.id}>{table.label}</option>)}</select>
            <select value={newMapping.tableFieldId} onChange={(event) => setNewMapping((current) => ({ ...current, tableFieldId: event.target.value }))}><option value="">Kolumn</option>{tableFields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select>
            <select value={newMapping.direction} onChange={(event) => setNewMapping((current) => ({ ...current, direction: event.target.value }))}><option value="read">Läs</option><option value="write">Skriv</option><option value="both">Båda</option></select>
            <button className="btn-ghost" onClick={add}><Icons.Plus /> Mappa</button>
        </div>
        {mappings.length > 0 && <div className="mapping-list">{mappings.map((mapping) => <MappingRow key={mapping.id} mapping={mapping} node={node} tables={tables} updateDataMapping={updateDataMapping} removeDataMapping={removeDataMapping} />)}</div>}
    </div>;
}

function MappingRow({ mapping, node, tables, updateDataMapping, removeDataMapping }) {
    const table = tables.find((item) => item.id === mapping.tableNodeId);
    return <div className="mapping-row"><span>{node.fields?.find((field) => field.id === mapping.modelFieldId)?.name || 'Saknat fält'}</span><span>→</span><span>{table ? `${table.label}.${table.fields?.find((field) => field.id === mapping.tableFieldId)?.name || 'Saknad kolumn'}` : 'Saknad tabell'}</span><select value={mapping.direction} onChange={(event) => updateDataMapping(mapping.id, { direction: event.target.value })}><option value="read">Läs</option><option value="write">Skriv</option><option value="both">Båda</option></select><button className="icon-btn-danger" onClick={() => removeDataMapping(mapping.id)}><Icons.X /></button></div>;
}

function ClassEditor({ node, models, addProperty, updateProperty, removeProperty, addMethod, updateMethod, removeMethod }) {
    return <><div className="section-divider"><label>Egenskaper (Fält)</label><div className="dynamic-list">{(node.properties || []).map((property) => <div key={property.id} className="dynamic-row"><select value={property.visibility} onChange={(event) => updateProperty(property.id, 'visibility', event.target.value)} style={{ width: '40px' }}><option value="+">+</option><option value="-">-</option><option value="#">#</option></select><input value={property.name} onChange={(event) => updateProperty(property.id, 'name', event.target.value)} placeholder="Namn" style={{ width: '40%' }} /><span className="colon-sep">:</span><input value={property.type} onChange={(event) => updateProperty(property.id, 'type', event.target.value)} placeholder="Typ" style={{ flex: 1 }} /><button className="icon-btn-danger" onClick={() => removeProperty(property.id)}><Icons.X /></button></div>)}</div><button className="btn-ghost full-width" onClick={addProperty}><Icons.Plus /> Lägg till egenskap</button></div>
    <div className="section-divider"><label>Metoder och datakontrakt</label><div className="dynamic-list">{(node.methods || []).map((method) => <div key={method.id} className="method-editor"><div className="dynamic-row"><select value={method.visibility} onChange={(event) => updateMethod(method.id, 'visibility', event.target.value)} style={{ width: '40px' }}><option value="+">+</option><option value="-">-</option><option value="#">#</option></select><input value={method.name} onChange={(event) => updateMethod(method.id, 'name', event.target.value)} placeholder="Namn()" style={{ width: '40%' }} /><input value={method.type} onChange={(event) => updateMethod(method.id, 'type', event.target.value)} placeholder="Retur" style={{ flex: 1 }} /><button className="icon-btn-danger" onClick={() => removeMethod(method.id)}><Icons.X /></button></div><div className="method-contracts"><span>IN</span><ModelSelect value={method.inputModelId} models={models} onChange={(value) => updateMethod(method.id, 'inputModelId', value)} /><span>OUT</span><ModelSelect value={method.returnModelId} models={models} onChange={(value) => updateMethod(method.id, 'returnModelId', value)} /></div></div>)}</div><button className="btn-ghost full-width" onClick={addMethod}><Icons.Plus /> Lägg till metod</button></div></>;
}
