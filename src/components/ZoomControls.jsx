import React from 'react';
import { Icons } from '../icons/Icons.jsx';

export default function ZoomControls({ zoom, onZoomIn, onZoomOut, onFit, onReset }) {
    return (
        <div className="zoom-controls">
            <button onClick={onZoomOut} className="zoom-btn" title="Zooma ut"><Icons.ZoomOut /></button>
            <span className="zoom-label">{Math.round(zoom * 100)}%</span>
            <button onClick={onZoomIn} className="zoom-btn" title="Zooma in"><Icons.ZoomIn /></button>
            <div className="divider" />
            <button onClick={onFit} className="zoom-btn" title="Anpassa vyn"><Icons.Maximize2 /> Anpassa</button>
            <button onClick={onReset} className="zoom-btn" title="Återställ"><Icons.RotateCcw /></button>
        </div>
    );
}
