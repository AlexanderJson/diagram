import { getNodeConfig } from '../data/nodeTypes.js';

function copyDefaults(defaults) {
    return {
        ...defaults,
        fields: defaults.fields ? [...defaults.fields] : undefined,
        properties: defaults.properties ? [...defaults.properties] : undefined,
        methods: defaults.methods ? [...defaults.methods] : undefined,
    };
}

export function createDiagramNode(type, { id, x, y, label, ...overrides } = {}) {
    const config = getNodeConfig(type);
    return {
        id: id || `node-${Date.now()}`,
        type,
        label: label || config.label,
        description: '',
        x,
        y,
        ...copyDefaults(config.defaults || {}),
        ...overrides,
    };
}
