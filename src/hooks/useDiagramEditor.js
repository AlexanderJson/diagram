import { useEffect, useRef, useState } from 'react';
import { getNodeDimensions } from '../utils/nodeLayout.js';

const emptyDragInfo = {
    isDragging: false,
    isResizing: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
    initialWidth: 0,
    initialHeight: 0,
    containedNodes: [],
};

export function useDiagramEditor() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [detailModalNodeId, setDetailModalNodeId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStartNode, setConnectionStartNode] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
    const [dragInfo, setDragInfo] = useState(emptyDragInfo);
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isAlert: false });
    const [isCopied, setIsCopied] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return undefined;

        const handleWheel = (event) => {
            event.preventDefault();
            const rect = wrapper.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const zoomFactor = event.deltaY < 0 ? 1.12 : 0.88;

            setZoom((previousZoom) => {
                const nextZoom = Math.min(Math.max(previousZoom * zoomFactor, 0.2), 3);
                setPan((previousPan) => {
                    const worldX = (mouseX - previousPan.x) / previousZoom;
                    const worldY = (mouseY - previousPan.y) / previousZoom;
                    return { x: mouseX - worldX * nextZoom, y: mouseY - worldY * nextZoom };
                });
                return nextZoom;
            });
        };

        wrapper.addEventListener('wheel', handleWheel, { passive: false });
        return () => wrapper.removeEventListener('wheel', handleWheel);
    }, []);

    const updateNode = (id, data) => {
        setNodes((currentNodes) => currentNodes.map((node) => node.id === id ? { ...node, ...data } : node));
    };

    const deleteNode = (id) => {
        setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
        setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== id && edge.target !== id));
        setSelectedNodeId(null);
    };

    const deleteEdge = (id) => setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== id));

    const createCustomNode = (name) => {
        const wrapperRect = wrapperRef.current?.getBoundingClientRect() || { width: 800, height: 600 };
        const worldX = (wrapperRect.width / 2 - pan.x) / zoom;
        const worldY = (wrapperRect.height / 2 - pan.y) / zoom;
        const newNode = {
            id: `node-${Date.now()}`,
            type: 'custom',
            label: name,
            description: '',
            x: worldX - 75 + (Math.random() * 40 - 20),
            y: worldY - 40 + (Math.random() * 40 - 20),
        };
        setNodes((currentNodes) => [...currentNodes, newNode]);
        setSelectedNodeId(newNode.id);
    };

    const resetView = () => {
        setPan({ x: 0, y: 0 });
        setZoom(1);
    };

    const fitView = () => {
        if (!nodes.length) {
            resetView();
            return;
        }

        const wrapperRect = wrapperRef.current?.getBoundingClientRect() || { width: 800, height: 600 };
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        nodes.forEach((node) => {
            const { width, height } = getNodeDimensions(node);
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + width);
            maxY = Math.max(maxY, node.y + height);
        });

        const padding = 100;
        const scaleX = wrapperRect.width / (maxX - minX + padding * 2);
        const scaleY = wrapperRect.height / (maxY - minY + padding * 2);
        const nextZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 1.5);
        setZoom(nextZoom);
        setPan({
            x: wrapperRect.width / 2 - ((minX + maxX) / 2) * nextZoom,
            y: wrapperRect.height / 2 - ((minY + maxY) / 2) * nextZoom,
        });
    };

    const zoomIn = () => setZoom((currentZoom) => Math.min(currentZoom * 1.15, 3));
    const zoomOut = () => setZoom((currentZoom) => Math.max(currentZoom * 0.85, 0.2));

    const handleSidebarDragStart = (event, type, label) => {
        event.dataTransfer.setData('nodeType', type);
        event.dataTransfer.setData('nodeLabel', label);
        event.dataTransfer.effectAllowed = 'copy';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('nodeType');
        const label = event.dataTransfer.getData('nodeLabel');
        if (!type || !wrapperRef.current) return;

        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const worldX = (event.clientX - wrapperRect.left - pan.x) / zoom;
        const worldY = (event.clientY - wrapperRect.top - pan.y) / zoom;
        const newNode = {
            id: `node-${Date.now()}`,
            type,
            label,
            description: '',
            x: worldX - (type === 'note' ? 96 : 75),
            y: worldY - (type === 'note' ? 64 : 40),
            ...(type === 'group' ? { width: 350, height: 250 } : {}),
        };
        setNodes((currentNodes) => [...currentNodes, newNode]);
        setSelectedNodeId(newNode.id);
    };

    const handleNodeMouseDown = (event, nodeId) => {
        event.stopPropagation();
        if (event.shiftKey || isConnecting) {
            if (!connectionStartNode) {
                setConnectionStartNode(nodeId);
                setIsConnecting(true);
            } else if (connectionStartNode !== nodeId) {
                setEdges((currentEdges) => [...currentEdges, { id: `edge-${Date.now()}`, source: connectionStartNode, target: nodeId }]);
                setConnectionStartNode(null);
                setIsConnecting(false);
            } else {
                setConnectionStartNode(null);
                setIsConnecting(false);
            }
            return;
        }

        setSelectedNodeId(nodeId);
        if (event.button !== 0) return;
        const node = nodes.find((item) => item.id === nodeId);
        if (!node) return;

        const containedNodes = node.type !== 'group' ? [] : nodes
            .filter((item) => item.id !== nodeId && item.x >= node.x && item.y >= node.y && item.x <= node.x + (node.width || 350) && item.y <= node.y + (node.height || 250))
            .map((item) => ({ id: item.id, initialX: item.x, initialY: item.y }));

        setDragInfo({
            ...emptyDragInfo,
            isDragging: true,
            nodeId,
            startX: event.clientX,
            startY: event.clientY,
            initialNodeX: node.x,
            initialNodeY: node.y,
            containedNodes,
        });
    };

    const handleResizeStart = (event, node) => {
        event.stopPropagation();
        setSelectedNodeId(node.id);
        setDragInfo({
            ...emptyDragInfo,
            isResizing: true,
            nodeId: node.id,
            startX: event.clientX,
            startY: event.clientY,
            initialWidth: node.width || 350,
            initialHeight: node.height || 250,
        });
    };

    const handleCanvasMouseDown = (event) => {
        if (event.button === 1 || event.button === 2 || event.target === wrapperRef.current || event.target.id === 'canvas-world') {
            setIsPanning(true);
            setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
        }
    };

    const handleMouseMove = (event) => {
        const wrapperRect = wrapperRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const mouseX = (event.clientX - wrapperRect.left - pan.x) / zoom;
        const mouseY = (event.clientY - wrapperRect.top - pan.y) / zoom;
        setMouseWorldPos({ x: mouseX, y: mouseY });

        if (isPanning) {
            setPan({ x: event.clientX - panStart.x, y: event.clientY - panStart.y });
            return;
        }

        if (dragInfo.isResizing && dragInfo.nodeId) {
            const deltaX = (event.clientX - dragInfo.startX) / zoom;
            const deltaY = (event.clientY - dragInfo.startY) / zoom;
            setNodes((currentNodes) => currentNodes.map((node) => node.id === dragInfo.nodeId ? {
                ...node,
                width: Math.max(150, dragInfo.initialWidth + deltaX),
                height: Math.max(100, dragInfo.initialHeight + deltaY),
            } : node));
            return;
        }

        if (dragInfo.isDragging && dragInfo.nodeId) {
            const deltaX = (event.clientX - dragInfo.startX) / zoom;
            const deltaY = (event.clientY - dragInfo.startY) / zoom;
            setNodes((currentNodes) => currentNodes.map((node) => {
                if (node.id === dragInfo.nodeId) return { ...node, x: dragInfo.initialNodeX + deltaX, y: dragInfo.initialNodeY + deltaY };
                const contained = dragInfo.containedNodes.find((item) => item.id === node.id);
                return contained ? { ...node, x: contained.initialX + deltaX, y: contained.initialY + deltaY } : node;
            }));
        }
    };

    const handleMouseUp = () => {
        if (isPanning) setIsPanning(false);
        if (dragInfo.isDragging || dragInfo.isResizing) setDragInfo(emptyDragInfo);
    };

    const handleCanvasClick = (event) => {
        if (event.target !== wrapperRef.current && event.target.id !== 'canvas-world') return;
        setSelectedNodeId(null);
        if (isConnecting) {
            setIsConnecting(false);
            setConnectionStartNode(null);
        }
    };

    const closeDialog = () => setDialog({ isOpen: false });
    const clearDiagram = () => setDialog({
        isOpen: true,
        title: 'Rensa Skiss',
        message: 'Är du säker på att du vill ta bort alla moduler och linjer?',
        isAlert: false,
        onConfirm: () => {
            setNodes([]);
            setEdges([]);
            setSelectedNodeId(null);
            closeDialog();
        },
    });

    const exportJson = () => {
        const href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ nodes, edges }))}`;
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.download = 'archsketch-export.json';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    };

    const importJson = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            try {
                const data = JSON.parse(loadEvent.target.result);
                if (Array.isArray(data.nodes)) {
                    setNodes(data.nodes);
                    setEdges(data.edges || []);
                    setSelectedNodeId(null);
                }
            } catch {
                setDialog({ isOpen: true, title: 'Fel vid import', message: 'Kunde inte läsa filen. Är det en giltig JSON?', isAlert: true });
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const share = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return {
        nodes, edges, selectedNodeId, detailModalNodeId, isConnecting, connectionStartNode,
        pan, zoom, isPanning, mouseWorldPos, dragInfo, dialog, isCopied, wrapperRef,
        updateNode, deleteNode, deleteEdge, createCustomNode, resetView, fitView, zoomIn, zoomOut,
        handleSidebarDragStart, handleDrop, handleNodeMouseDown, handleResizeStart,
        handleCanvasMouseDown, handleMouseMove, handleMouseUp, handleCanvasClick,
        clearDiagram, closeDialog, exportJson, importJson, share,
        setSelectedNodeId, setDetailModalNodeId,
    };
}
