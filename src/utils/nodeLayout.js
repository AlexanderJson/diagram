export function getNodeDimensions(node) {
    if (node.type === 'note') return { width: 192, height: 128 };
    if (node.type === 'group') return { width: node.width || 350, height: node.height || 250 };
    if (node.type === 'dbtable') return { width: 180, height: 100 + (node.fields?.length || 0) * 24 };
    if (node.type === 'classnode' || node.type === 'interface') {
        return {
            width: 220,
            height: 120 + (node.properties?.length || 0) * 20 + (node.methods?.length || 0) * 20,
        };
    }

    return { width: 150, height: 80 };
}

export function getNodeCenter(node) {
    const { width, height } = getNodeDimensions(node);
    return { x: node.x + width / 2, y: node.y + height / 2 };
}
