import { createStore } from '@xstate/store';

import type { ShortcutObj, ShortcutStoreObj } from '@/types';

const initial = { shortcuts: [] } as ShortcutStoreObj;

export const shortcutStore = createStore({
    context: initial,
    on: {
        add: (context, event: ShortcutObj) => {
            const shortcut = {
                keyCode: event.keyCode,
                description: event.description,
                fn: event.fn,
                ...(event.modifier && { modifier: event.modifier }),
            };

            console.log({
                existing: context.shortcuts,
                new: shortcut,
                combined: [...context.shortcuts, shortcut],
            });

            return {
                shortcuts: [...context.shortcuts, shortcut],
            };
        },
        remove: (context, event: { keyCode: string | Array<string> }) => ({
            shortcuts: [
                ...context.shortcuts.filter((shortcut) => shortcut.keyCode !== event.keyCode),
            ],
        }),
        reset: () => initial,
    },
});
