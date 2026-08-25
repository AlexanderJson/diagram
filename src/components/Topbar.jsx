import React from 'react';
import { Icons } from '../icons/Icons.jsx';

export default function Topbar({ isConnecting, isCopied, onShare, onImport, onExport, onClear }) {
    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="mode-indicator">
                    <span style={{ fontWeight: 600 }}>Läge:</span>
                    <span className={`mode-badge ${isConnecting ? 'mode-connecting' : 'mode-normal'}`}>
                        {isConnecting ? 'Kopplar (Klicka målnod)' : 'Välj & Flytta'}
                    </span>
                </div>
                <div className="helper-text"><Icons.Move /> Panorera: Dra bakgrund / Högerklick</div>
            </div>
            <div className="topbar-right">
                <button className="btn-primary-action" onClick={onShare}>
                    {isCopied ? <Icons.Check /> : <Icons.Share2 />}
                    {isCopied ? 'Kopierad!' : 'Dela'}
                </button>
                <div className="divider" />
                <label className="btn-action">
                    <Icons.Upload /> Importera
                    <input type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
                </label>
                <button className="btn-action" onClick={onExport}><Icons.Download /> Exportera</button>
                <div className="divider" />
                <button className="btn-danger-action btn-action" onClick={onClear}><Icons.Trash2 /> Rensa</button>
            </div>
        </div>
    );
}
