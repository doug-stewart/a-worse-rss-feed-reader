import { useEffect } from 'react';

import type { ShortcutObj } from '../types';

import { useShortcutsActions } from '@/features/shortcuts/stores/shortcuts.store';

export const useShortcut = (shortcut: ShortcutObj) => {
    const { add, remove } = useShortcutsActions();

    useEffect(() => {
        const { description, fn, keyCode, modifier } = shortcut;

        add({
            keyCode: keyCode,
            modifier: modifier,
            description: description,
            fn: fn,
        });

        return () => remove(keyCode);
    }, [shortcut, add, remove]);
};
