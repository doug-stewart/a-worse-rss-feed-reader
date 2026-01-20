import { useEffect, useRef } from 'react';

import { useShortcut } from '../../hooks/useShortcut';
import { useShortcuts } from '../../stores/shortcuts.store';
import { Shortcut } from '../shortcut/Shortcut';

export const ShortcutsControl = () => {
    const shortcuts = useShortcuts();

    const dialog = useRef<HTMLDialogElement | null>(null);

    useShortcut({
        keyCode: '?',
        modifier: 'shift',
        description: 'Opens the shortcuts dialog',
        fn: () => dialog.current?.showModal(),
    });

    // Listen for key presses and execute shortcuts when found
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Ignore key presses inside form fields
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            // If we find a shortcut, execute its function
            shortcuts
                .find((shortcut) => {
                    let matches = shortcut.keyCode.toLowerCase() === event.key.toLowerCase();

                    if (shortcut.modifier === 'shift') {
                        matches = matches && event.shiftKey;
                    }

                    return matches;
                })
                ?.fn();
        };

        document.addEventListener('keyup', handleKeyPress);
        return () => document.removeEventListener('keyup', handleKeyPress);
    }, [dialog, shortcuts]);

    return (
        <dialog ref={dialog}>
            <button onClick={() => dialog.current?.close()} autoFocus>
                Close
            </button>
            <dl>
                {shortcuts
                    .sort((kbA, kbB) =>
                        kbA.keyCode.localeCompare(kbB.keyCode, 'en', { sensitivity: 'base' }),
                    )
                    .map((shortcut) => (
                        <Shortcut key={shortcut.keyCode} shortcut={shortcut} />
                    ))}
            </dl>
        </dialog>
    );
};
