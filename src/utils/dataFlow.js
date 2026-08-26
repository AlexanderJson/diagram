import { isDataModelNode } from './nodeLayout.js';

export const DATA_MODEL_TYPES = ['dto', 'record', 'entity', 'model'];

export function isDataModel(node) {
    return Boolean(node) && isDataModelNode(node);
}

export function createDataField() {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: 'newField',
        type: 'string',
        classification: 'normal',
        persistenceBacked: false,
    };
}

export function normalizeFieldName(name = '') {
    return name.replace(/[_\-\s]/g, '').toLowerCase();
}

export function findSuggestedMappings(modelNode, nodes, existingMappings = []) {
    if (!isDataModel(modelNode)) return [];
    const tables = nodes.filter((node) => node.type === 'dbtable');
    return (modelNode.fields || []).flatMap((modelField) => {
        const mapped = existingMappings.some((mapping) => mapping.modelNodeId === modelNode.id && mapping.modelFieldId === modelField.id);
        if (mapped) return [];
        const name = normalizeFieldName(modelField.name);
        const match = tables.flatMap((table) => (table.fields || []).map((field) => ({ table, field })))
            .find(({ field }) => normalizeFieldName(field.name) === name);
        return match ? [{ modelField, tableNode: match.table, tableField: match.field }] : [];
    });
}

function mappingRole(mapping, forcedRole) {
    if (forcedRole) return forcedRole;
    if (mapping.direction === 'write') return 'input';
    if (mapping.direction === 'read') return 'output';
    return 'both';
}

function addHighlight(highlights, nodeId, fieldId, role) {
    const key = `${nodeId}:${fieldId}`;
    const previous = highlights.get(key);
    highlights.set(key, previous && previous !== role ? 'both' : role);
}

export function getSelectionFlow({ nodes, dataMappings, selectedNodeId, selectedMethodId }) {
    const selected = nodes.find((node) => node.id === selectedNodeId);
    if (!selected) return { lines: [], highlights: new Map() };

    const requests = [];
    if (isDataModel(selected)) {
        dataMappings.filter((mapping) => mapping.modelNodeId === selected.id)
            .forEach((mapping) => requests.push({ mapping, role: mappingRole(mapping) }));
    } else if (selected.type === 'endpoint') {
        if (selected.requestModelId) dataMappings.filter((mapping) => mapping.modelNodeId === selected.requestModelId)
            .forEach((mapping) => requests.push({ mapping, role: 'input', viaNode: selected }));
        if (selected.responseModelId) dataMappings.filter((mapping) => mapping.modelNodeId === selected.responseModelId)
            .forEach((mapping) => requests.push({ mapping, role: 'output', viaNode: selected }));
    } else if ((selected.type === 'classnode' || selected.type === 'interface') && selectedMethodId) {
        const method = (selected.methods || []).find((item) => item.id === selectedMethodId);
        if (method?.inputModelId) dataMappings.filter((mapping) => mapping.modelNodeId === method.inputModelId)
            .forEach((mapping) => requests.push({ mapping, role: 'input', viaNode: selected }));
        if (method?.returnModelId) dataMappings.filter((mapping) => mapping.modelNodeId === method.returnModelId)
            .forEach((mapping) => requests.push({ mapping, role: 'output', viaNode: selected }));
    }

    const highlights = new Map();
    requests.forEach(({ mapping, role }) => {
        const model = nodes.find((node) => node.id === mapping.modelNodeId);
        const table = nodes.find((node) => node.id === mapping.tableNodeId);
        if (!isDataModel(model) || table?.type !== 'dbtable') return;
        if (!(model.fields || []).some((field) => field.id === mapping.modelFieldId)) return;
        if (!(table.fields || []).some((field) => field.id === mapping.tableFieldId)) return;
        addHighlight(highlights, model.id, mapping.modelFieldId, role);
        addHighlight(highlights, table.id, mapping.tableFieldId, role);
    });
    return { lines: [], highlights };
}

export function getFlowWarnings(nodes, edges, dataMappings) {
    const warnings = [];
    const modelNodes = nodes.filter(isDataModel);
    const byId = new Map(nodes.map((node) => [node.id, node]));

    nodes.filter((node) => node.type === 'endpoint').forEach((endpoint) => {
        if (endpoint.requestType?.trim() && !endpoint.requestModelId) {
            warnings.push({ id: `endpoint-input-${endpoint.id}`, nodeId: endpoint.id, title: 'Input saknar modell', detail: `${endpoint.label} har förväntad data men ingen kopplad modell.` });
        }
        if (endpoint.responseType?.trim() && !endpoint.responseModelId) {
            warnings.push({ id: `endpoint-output-${endpoint.id}`, nodeId: endpoint.id, title: 'Svar saknar modell', detail: `${endpoint.label} har returdata men ingen kopplad modell.` });
        }
        const directDatabase = edges.some((edge) => {
            const otherId = edge.source === endpoint.id ? edge.target : edge.target === endpoint.id ? edge.source : null;
            return ['dbtable', 'sqldb', 'nosqldb'].includes(byId.get(otherId)?.type);
        });
        if (directDatabase) warnings.push({ id: `endpoint-db-${endpoint.id}`, nodeId: endpoint.id, title: 'Endpoint direkt till databas', detail: `${endpoint.label} har en vanlig arkitekturkoppling direkt till en databastabell.` });
    });

    modelNodes.forEach((model) => (model.fields || []).forEach((field) => {
        if (field.persistenceBacked && !dataMappings.some((mapping) => mapping.modelNodeId === model.id && mapping.modelFieldId === field.id)) {
            warnings.push({ id: `unmapped-${model.id}-${field.id}`, nodeId: model.id, title: 'Persistence-fält saknar mappning', detail: `${model.label}.${field.name} är märkt som persistence-backed men saknar en tabellkolumn.` });
        }
    }));

    nodes.filter((node) => node.type === 'endpoint' && node.responseModelId).forEach((endpoint) => {
        dataMappings.filter((mapping) => mapping.modelNodeId === endpoint.responseModelId && mapping.direction !== 'write').forEach((mapping) => {
            const table = byId.get(mapping.tableNodeId);
            const field = table?.fields?.find((item) => item.id === mapping.tableFieldId);
            if (field && ['sensitive', 'secret'].includes(field.classification)) {
                const model = byId.get(mapping.modelNodeId);
                warnings.push({
                    id: `sensitive-response-${endpoint.id}-${mapping.id}`,
                    nodeId: endpoint.id,
                    title: `${field.classification === 'secret' ? 'Secret' : 'Sensitive'} data i API-svar`,
                    detail: `${endpoint.label} returnerar ${model?.label || 'modell'}.${model?.fields?.find((item) => item.id === mapping.modelFieldId)?.name || 'fält'} från ${table.label}.${field.name}.`,
                });
            }
        });
    });

    return warnings;
}
