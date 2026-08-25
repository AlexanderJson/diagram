import React from 'react';

export default function Dialog({ dialog, onClose }) {
    if (!dialog.isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 200 }}>
            <div className="dialog-box">
                <h3>{dialog.title}</h3>
                <p>{dialog.message}</p>
                <div className="dialog-actions">
                    {!dialog.isAlert && <button onClick={onClose} className="btn-text">Avbryt</button>}
                    <button onClick={dialog.onConfirm || onClose} className="btn-primary">
                        {dialog.isAlert ? 'OK' : 'Bekräfta'}
                    </button>
                </div>
            </div>
        </div>
    );
}
