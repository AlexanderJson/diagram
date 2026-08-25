import React, { useState } from 'react';
import { Icons } from '../icons/Icons.jsx';
import { DIAGRAM_TEMPLATES } from '../data/diagramTemplates.js';
import { NODE_TYPES } from '../data/nodeTypes.js';

export default function Sidebar({ onDragStart, onCreateCustomNode, onAddTemplate }) {
    // useState is like declaring a private instance variable: `private string customName = "";`
    // The setter (setCustomName) is the only way to mutate it, triggering a re-render.
    const [customName, setCustomName] = useState('');

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>
                    <Icons.Layers /> ArchSketch
                </h2>
                <p>Dra och släpp komponenter.</p>
            </div>

            <div className="sidebar-content">
                {NODE_TYPES.map((category, idx) => (
                    <div key={idx} className="sidebar-category">
                        <h3>{category.category}</h3>
                        <div className="sidebar-grid">
                            {category.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={itemIdx}
                                        className={`sidebar-item ${item.colorClass}-border`}
                                        onDragStart={(e) => onDragStart(e, item.type, item.label)}
                                        draggable
                                        title={item.label}
                                    >
                                        <div className="icon-wrapper">
                                            <Icon />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="sidebar-category template-category">
                    <h3>Snabbstartsmallar</h3>
                    <p className="template-helper">Valfria startpunkter. Alla noder kan ändras efteråt.</p>
                    <div className="template-list">
                        {DIAGRAM_TEMPLATES.map((template) => (
                            <button key={template.id} className="template-item" onClick={() => onAddTemplate(template.id)}>
                                <span className="template-item-title"><Icons.Layers /> {template.label}</span>
                                <span className="template-item-description">{template.description}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="sidebar-footer">
                <h3><Icons.Box /> Skapa Egen Modul</h3>
                <div className="custom-module-input">
                    <input
                        type="text"
                        placeholder="Namn på modul..."
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        onKeyDown={(e) => { 
                            if (e.key === 'Enter') { 
                                onCreateCustomNode(customName || 'Egen Modul'); 
                                setCustomName(''); 
                            } 
                        }}
                    />
                    <button
                        onClick={() => { 
                            onCreateCustomNode(customName || 'Egen Modul'); 
                            setCustomName(''); 
                        }}
                    >
                        Lägg till
                    </button>
                </div>
            </div>
        </aside>
    );
}
