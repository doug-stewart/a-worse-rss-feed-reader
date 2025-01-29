import { useEffect } from 'react';

import { shortcutStore } from '@/stores/shortcuts.store';
import { ShortcutObj } from '@/types';

export const useShortcut = (shortcut: ShortcutObj) => {
    useEffect(() => {
        const { description, fn, keyCode, modifier } = shortcut;

        shortcutStore.send({
            type: 'add',
            keyCode: keyCode,
            modifier: modifier,
            description: description,
            fn: fn,
        });

        return () => {
            shortcutStore.send({ type: 'remove', keyCode: keyCode });
        };
    }, [shortcut]);
};
