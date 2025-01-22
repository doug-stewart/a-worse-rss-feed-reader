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

            return {
                shortcuts: [...context.shortcuts, shortcut],
            };
        },
        remove: (context, event: { keyCode: ShortcutObj['keyCode'] }) => ({
            shortcuts: [
                ...context.shortcuts.filter(
                    (shortcut) => shortcut.keyCode.toLowerCase() !== event.keyCode.toLowerCase(),
                ),
            ],
        }),
        reset: () => initial,
    },
});
