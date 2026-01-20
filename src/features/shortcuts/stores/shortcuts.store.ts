import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ShortcutObj } from '../types';

export type ShortcutsStoreState = {
    shortcuts: Array<ShortcutObj>;
    actions: {
        initialize: (shortcuts: Array<ShortcutObj>) => void;
        add: (shortcut: ShortcutObj) => void;
        remove: (keyCode: string) => void;
    };
};

const useShortcutsStore = create<ShortcutsStoreState>()(
    persist(
        (set) => ({
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
        }),
        {
            name: 'shortcuts-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ shortcuts: state.shortcuts }),
        },
    ),
);

export const useShortcuts = () => useShortcutsStore((state) => state.shortcuts);

export const useShortcutsActions = () => useShortcutsStore((state) => state.actions);
