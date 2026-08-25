import { getNodeConfig } from '../data/nodeTypes.js';

function copyDefaults(defaults) {
    return {
        ...defaults,
        fields: defaults.fields ? defaults.fields.map((field) => ({ ...field })) : undefined,
        properties: defaults.properties ? [...defaults.properties] : undefined,
        methods: defaults.methods ? [...defaults.methods] : undefined,
    };
}

export function createDiagramNode(type, { id, x, y, label, ...overrides } = {}) {
    const config = getNodeConfig(type);
    const endpointMatch = type === 'endpoint' && label?.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/i);
    return {
        id: id || `node-${Date.now()}`,
        type,
        label: label || config.label,
        description: '',
        x,
        y,
        ...copyDefaults(config.defaults || {}),
        ...(endpointMatch ? { httpMethod: endpointMatch[1].toUpperCase(), route: endpointMatch[2] } : {}),
        ...overrides,
    };
}
