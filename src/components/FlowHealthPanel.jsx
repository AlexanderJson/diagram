import React from 'react';
import { Icons } from '../icons/Icons.jsx';

export default function FlowHealthPanel({ warnings, onClose, onSelectNode }) {
    return (
        <aside className="flow-health-panel" aria-label="Flow Health">
            <div className="flow-health-header">
                <h3><Icons.AlertTriangle /> Flow Health</h3>
                <button className="icon-btn-small" onClick={onClose}><Icons.X /></button>
            </div>
            <div className="flow-health-body">
                <p className="flow-health-intro">Planeringssignaler – inte en säkerhetsgranskning.</p>
                {warnings.length === 0 ? <div className="flow-health-empty">Inga flödesvarningar just nu.</div> : warnings.map((warning) => (
                    <button key={warning.id} className="flow-warning" onClick={() => onSelectNode(warning.nodeId)}>
                        <strong>{warning.title}</strong>
                        <span>{warning.detail}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}
