import React from 'react';
import { Icons } from '../icons/Icons.jsx';

const colorOptions = [
    { key: 'input', label: 'Input / skrivfält' },
    { key: 'output', label: 'Output / läsfält' },
    { key: 'both', label: 'Båda-riktningar' },
];

export default function AppearancePanel({ appearance, onClose, onSetMode, onSetColor, onReset }) {
    return <aside className="appearance-panel" aria-label="Utseende">
        <div className="appearance-header"><h3><Icons.Settings /> Utseende</h3><button className="icon-btn-small" onClick={onClose}><Icons.X /></button></div>
        <div className="appearance-body">
            <label className="appearance-label">Tema<select value={appearance.mode} onChange={(event) => onSetMode(event.target.value)}><option value="light">Ljust</option><option value="warm-dark">Varmt mörkt</option></select></label>
            <div className="appearance-colors"><span>Fältglöd</span>{colorOptions.map((option) => <label key={option.key} className="color-control"><input type="color" value={appearance.colors[option.key]} onChange={(event) => onSetColor(option.key, event.target.value)} /><span>{option.label}</span></label>)}</div>
            <button className="btn-ghost full-width" onClick={onReset}><Icons.RotateCcw /> Återställ färger</button>
            <p>Inställningarna sparas bara i den här webbläsaren.</p>
        </div>
    </aside>;
}
