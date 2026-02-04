import { create } from 'zustand';

import type { ShortcutObj } from '../types';

export type ShortcutsStoreState = {
    shortcuts: Array<ShortcutObj>;
    actions: {
        initialize: (shortcuts: Array<ShortcutObj>) => void;
        add: (shortcut: ShortcutObj) => void;
        remove: (keyCode: string) => void;
    };
};

const useShortcutsStore = create<ShortcutsStoreState>()((set) => ({
    shortcuts: [],
    actions: {
        initialize: (shortcuts: Array<ShortcutObj>) => set(() => ({ shortcuts })),
        add: (shortcut: ShortcutObj) =>
            set((state) => ({ shortcuts: [...state.shortcuts, shortcut] })),
        remove: (keyCode: string) =>
            set((state) => ({
                shortcuts: state.shortcuts.filter(
                    (s) => s.keyCode.toLowerCase() !== keyCode.toLowerCase(),
                ),
            })),
    },
}));

export const useShortcuts = () => useShortcutsStore((state) => state.shortcuts);
export const useShortcutsActions = () => useShortcutsStore((state) => state.actions);
