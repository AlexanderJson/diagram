import { useEffect, useState } from 'react';

const storageKey = 'archsketch-appearance';
const defaults = {
    mode: 'light',
    colors: { input: '#f97316', output: '#2563eb', both: '#7c3aed' },
};

function loadAppearance() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(storageKey));
        return { ...defaults, ...saved, colors: { ...defaults.colors, ...saved?.colors } };
    } catch {
        return defaults;
    }
}

export function useAppearance() {
    const [appearance, setAppearance] = useState(loadAppearance);
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

    useEffect(() => {
        document.documentElement.dataset.theme = appearance.mode;
        document.documentElement.style.setProperty('--flow-input', appearance.colors.input);
        document.documentElement.style.setProperty('--flow-output', appearance.colors.output);
        document.documentElement.style.setProperty('--flow-both', appearance.colors.both);
        window.localStorage.setItem(storageKey, JSON.stringify(appearance));
    }, [appearance]);

    const setMode = (mode) => setAppearance((current) => ({ ...current, mode }));
    const setColor = (key, value) => setAppearance((current) => ({ ...current, colors: { ...current.colors, [key]: value } }));
    const resetAppearance = () => setAppearance(defaults);

    return { appearance, isAppearanceOpen, setIsAppearanceOpen, setMode, setColor, resetAppearance };
}
