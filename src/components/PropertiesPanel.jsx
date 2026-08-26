import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons/Icons.jsx';
import { createDataField, findSuggestedMappings, isDataModel, normalizeFieldName } from '../utils/dataFlow.js';

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
    const [selectedMappingTableIds, setSelectedMappingTableIds] = useState([]);
    const modelNodes = useMemo(() => nodes.filter(isDataModel), [nodes]);
    const tableNodes = useMemo(() => nodes.filter((item) => item.type === 'dbtable'), [nodes]);
    useEffect(() => {
        setSelectedMappingTableIds([]);
    }, [node?.id]);
    if (!node || node.type === 'note') return null;

    const isFieldNode = node.type === 'dbtable' || isDataModel(node);
    const isClassType = node.type === 'classnode' || node.type === 'interface';
    const currentMappings = dataMappings.filter((mapping) => mapping.modelNodeId === node.id);
    const suggestions = findSuggestedMappings(node, nodes, dataMappings);

    const addField = () => updateNode(node.id, { fields: [...(node.fields || []), createDataField()] });
    const updateField = (fieldId, key, value) => updateNode(node.id, { fields: (node.fields || []).map((field) => field.id === fieldId ? { ...field, [key]: value } : field) });
    const removeField = (fieldId) => updateNode(node.id, { fields: (node.fields || []).filter((field) => field.id !== fieldId) });
    const addClassProperty = () => updateNode(node.id, { properties: [...(node.properties || []), { id: `${Date.now()}`, visibility: '+', name: 'nyttFält', type: 'string' }] });
    const updateClassProperty = (propertyId, key, value) => updateNode(node.id, { properties: (node.properties || []).map((property) => property.id === propertyId ? { ...property, [key]: value } : property) });
    const removeClassProperty = (propertyId) => updateNode(node.id, { properties: (node.properties || []).filter((property) => property.id !== propertyId) });
    const addClassMethod = () => updateNode(node.id, { methods: [...(node.methods || []), { id: `${Date.now()}`, visibility: '+', name: 'NyMetod', type: 'void', inputModelId: null, returnModelId: null }] });
    const updateClassMethod = (methodId, key, value) => updateNode(node.id, { methods: (node.methods || []).map((method) => method.id === methodId ? { ...method, [key]: value } : method) });
    const removeClassMethod = (methodId) => updateNode(node.id, { methods: (node.methods || []).filter((method) => method.id !== methodId) });
    const addMappingsFromTable = (table, drafts) => {
        const nextFields = [...(node.fields || [])];
        const mappingsToAdd = drafts.filter((draft) => draft.tableFieldId).map((draft) => {
            const tableField = table.fields?.find((field) => field.id === draft.tableFieldId);
            if (!tableField) return null;
            let modelFieldId = draft.modelFieldId;
            if (!modelFieldId) {
                const existingField = nextFields.find((field) => normalizeFieldName(field.name) === normalizeFieldName(tableField.name));
                if (existingField) {
                    modelFieldId = existingField.id;
                } else {
                    const newField = { ...createDataField(), name: tableField.name, type: tableField.type, persistenceBacked: true };
                    nextFields.push(newField);
                    modelFieldId = newField.id;
                }
            }
            return { modelNodeId: node.id, modelFieldId, tableNodeId: table.id, tableFieldId: tableField.id, direction: draft.direction };
        }).filter(Boolean);
        if (nextFields.length !== (node.fields || []).length) updateNode(node.id, { fields: nextFields });
        mappingsToAdd.forEach(addDataMapping);
    };
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

                    {isDataModel(node) && <DataMappingEditor node={node} tables={tableNodes} mappings={currentMappings} suggestions={suggestions} selectedTableIds={selectedMappingTableIds} setSelectedTableIds={setSelectedMappingTableIds} addDataMapping={addDataMapping} addMappingsFromTable={addMappingsFromTable} updateDataMapping={updateDataMapping} removeDataMapping={removeDataMapping} />}

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

function DataMappingEditor({ node, tables, mappings, suggestions, selectedTableIds, setSelectedTableIds, addDataMapping, addMappingsFromTable, updateDataMapping, removeDataMapping }) {
    const selectedTables = tables.filter((table) => selectedTableIds.includes(table.id));
    return <div className="section-divider"><label>Databas-mappningar</label>
        {suggestions.length > 0 && <div className="mapping-suggestions"><span>Samma namn hittades:</span>{suggestions.map((suggestion) => <button key={`${suggestion.modelField.id}-${suggestion.tableNode.id}`} className="suggestion-btn" onClick={() => addDataMapping({ modelNodeId: node.id, modelFieldId: suggestion.modelField.id, tableNodeId: suggestion.tableNode.id, tableFieldId: suggestion.tableField.id, direction: 'both' })}>Koppla {suggestion.modelField.name} → {suggestion.tableNode.label}.{suggestion.tableField.name}</button>)}</div>}
        <div className="mapping-table-selector"><span>Välj en eller flera tabeller</span><select multiple value={selectedTableIds} onChange={(event) => setSelectedTableIds(Array.from(event.target.selectedOptions, (option) => option.value))}>{tables.map((table) => <option key={table.id} value={table.id}>{table.label}</option>)}</select><small>Håll Ctrl (Windows) eller Cmd (Mac) för att välja flera.</small></div>
        {selectedTables.map((table) => <TableMappingComposer key={table.id} node={node} table={table} onSaveDrafts={addMappingsFromTable} />)}
        {mappings.length > 0 && <div className="mapping-list">{mappings.map((mapping) => <MappingRow key={mapping.id} mapping={mapping} node={node} tables={tables} updateDataMapping={updateDataMapping} removeDataMapping={removeDataMapping} />)}</div>}
    </div>;
}

function TableMappingComposer({ node, table, onSaveDrafts }) {
    const createDraft = () => ({ modelFieldId: '', tableFieldId: '', direction: 'both' });
    const [drafts, setDrafts] = useState([createDraft()]);
    useEffect(() => {
        setDrafts([createDraft()]);
    }, [node.id, table.id]);
    const updateDraft = (index, key, value) => setDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, [key]: value } : draft));
    const validDrafts = drafts.filter((draft) => draft.tableFieldId);
    const saveDrafts = () => {
        onSaveDrafts(table, validDrafts);
        setDrafts([createDraft()]);
    };
    return <div className="mapping-table-composer"><strong>{table.label}</strong><span className="mapping-table-helper">Välj en befintlig modellfält, eller lämna den tom för att skapa ett fält från kolumnens namn och typ.</span><div className="mapping-draft-list">{drafts.map((draft, index) => <div className="mapping-draft-row" key={index}><select value={draft.modelFieldId} onChange={(event) => updateDraft(index, 'modelFieldId', event.target.value)}><option value="">Skapa från kolumn</option>{(node.fields || []).map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select><select value={draft.tableFieldId} onChange={(event) => updateDraft(index, 'tableFieldId', event.target.value)}><option value="">Kolumn</option>{(table.fields || []).map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select><select value={draft.direction} onChange={(event) => updateDraft(index, 'direction', event.target.value)}><option value="read">Läs</option><option value="write">Skriv</option><option value="both">Båda</option></select>{drafts.length > 1 && <button className="icon-btn-danger" onClick={() => setDrafts((current) => current.filter((_, draftIndex) => draftIndex !== index))}><Icons.X /></button>}</div>)}</div><div className="mapping-composer-actions"><button className="btn-ghost" onClick={() => setDrafts((current) => [...current, createDraft()])}><Icons.Plus /> Lägg till fältpar</button><button className="btn-ghost" onClick={saveDrafts} disabled={validDrafts.length === 0}><Icons.Check /> Mappa {validDrafts.length || ''} fält{validDrafts.length === 1 ? '' : 'par'}</button></div></div>;
}

function MappingRow({ mapping, node, tables, updateDataMapping, removeDataMapping }) {
    const table = tables.find((item) => item.id === mapping.tableNodeId);
    return <div className="mapping-row"><span>{node.fields?.find((field) => field.id === mapping.modelFieldId)?.name || 'Saknat fält'}</span><span>→</span><span>{table ? `${table.label}.${table.fields?.find((field) => field.id === mapping.tableFieldId)?.name || 'Saknad kolumn'}` : 'Saknad tabell'}</span><select value={mapping.direction} onChange={(event) => updateDataMapping(mapping.id, { direction: event.target.value })}><option value="read">Läs</option><option value="write">Skriv</option><option value="both">Båda</option></select><button className="icon-btn-danger" onClick={() => removeDataMapping(mapping.id)}><Icons.X /></button></div>;
}

function ClassEditor({ node, models, addProperty, updateProperty, removeProperty, addMethod, updateMethod, removeMethod }) {
    return <><div className="section-divider"><label>Egenskaper (Fält)</label><div className="dynamic-list">{(node.properties || []).map((property) => <div key={property.id} className="dynamic-row"><select value={property.visibility} onChange={(event) => updateProperty(property.id, 'visibility', event.target.value)} style={{ width: '40px' }}><option value="+">+</option><option value="-">-</option><option value="#">#</option></select><input value={property.name} onChange={(event) => updateProperty(property.id, 'name', event.target.value)} placeholder="Namn" style={{ width: '40%' }} /><span className="colon-sep">:</span><input value={property.type} onChange={(event) => updateProperty(property.id, 'type', event.target.value)} placeholder="Typ" style={{ flex: 1 }} /><button className="icon-btn-danger" onClick={() => removeProperty(property.id)}><Icons.X /></button></div>)}</div><button className="btn-ghost full-width" onClick={addProperty}><Icons.Plus /> Lägg till egenskap</button></div>
    <div className="section-divider"><label>Metoder och datakontrakt</label><div className="dynamic-list">{(node.methods || []).map((method) => <div key={method.id} className="method-editor"><div className="dynamic-row"><select value={method.visibility} onChange={(event) => updateMethod(method.id, 'visibility', event.target.value)} style={{ width: '40px' }}><option value="+">+</option><option value="-">-</option><option value="#">#</option></select><input value={method.name} onChange={(event) => updateMethod(method.id, 'name', event.target.value)} placeholder="Namn()" style={{ width: '40%' }} /><input value={method.type} onChange={(event) => updateMethod(method.id, 'type', event.target.value)} placeholder="Retur" style={{ flex: 1 }} /><button className="icon-btn-danger" onClick={() => removeMethod(method.id)}><Icons.X /></button></div><div className="method-contracts"><span>IN</span><ModelSelect value={method.inputModelId} models={models} onChange={(value) => updateMethod(method.id, 'inputModelId', value)} /><span>OUT</span><ModelSelect value={method.returnModelId} models={models} onChange={(value) => updateMethod(method.id, 'returnModelId', value)} /></div></div>)}</div><button className="btn-ghost full-width" onClick={addMethod}><Icons.Plus /> Lägg till metod</button></div></>;
}
