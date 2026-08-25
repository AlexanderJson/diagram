import React from 'react';
import { Icons } from '../icons/Icons.jsx';

export default function DetailModal({ node, onClose, updateNode }) {
    if (!node) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2><Icons.Maximize2 /> Detaljer: {node.label}</h2>
                    <button className="icon-btn" onClick={onClose}>
                        <Icons.X />
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Modulens Namn</label>
                            <input 
                                type="text" 
                                value={node.label || ''}
                                onChange={(e) => updateNode(node.id, { label: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Kort Beskrivning (syns i rutan)</label>
                            <input 
                                type="text" 
                                value={node.description || ''}
                                onChange={(e) => updateNode(node.id, { description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group flex-fill">
                        <label>Utförlig Dokumentation (Klasser, Kod, Anteckningar)</label>
                        <textarea 
                            className="code-textarea"
                            placeholder="Skriv teknisk specifikation, metoder, klass-namn, API-endpoints, etc..."
                            value={node.detailedContent || ''}
                            onChange={(e) => updateNode(node.id, { detailedContent: e.target.value })}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>
                        Stäng & Spara
                    </button>
                </div>
            </div>
        </div>
    );
}
