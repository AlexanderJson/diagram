export function getNodeDimensions(node) {
    if (node.type === 'note') return { width: 192, height: 128 };
    if (node.type === 'group') return { width: node.width || 350, height: node.height || 250 };
    if (node.type === 'dbtable' || isDataModelNode(node)) {
        return { width: 210, height: 78 + Math.max(1, node.fields?.length || 0) * 24 };
    }
    if (node.type === 'endpoint') return { width: 220, height: 118 };
    if (node.type === 'classnode' || node.type === 'interface') {
        return {
            width: 220,
            height: 120 + (node.properties?.length || 0) * 20 + (node.methods?.length || 0) * 20,
        };
    }

    return { width: 150, height: 80 };
}

export function isDataModelNode(node) {
    return ['dto', 'record', 'entity', 'model'].includes(node.type);
}

export function getNodeCenter(node) {
    const { width, height } = getNodeDimensions(node);
    return { x: node.x + width / 2, y: node.y + height / 2 };
}

export function getFieldAnchor(node, fieldId, side = 'right') {
    const index = (node.fields || []).findIndex((field) => field.id === fieldId);
    const { width } = getNodeDimensions(node);
    const rowIndex = Math.max(index, 0);
    return {
        x: node.x + (side === 'left' ? 2 : width - 2),
        y: node.y + 62 + rowIndex * 24,
    };
}
