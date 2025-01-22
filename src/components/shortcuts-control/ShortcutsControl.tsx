import { useSelector } from '@xstate/store/react';
import { useEffect, useRef } from 'react';

import styles from './ShortcutsControl.module.css';

import { shortcutStore } from '@/stores/shortcuts.store';
import { ShortcutObj } from '@/types';

export const ShortcutsControl = () => {
    const kbShortcuts = useSelector(shortcutStore, (state) => state.context.shortcuts);
    const dialog = useRef<HTMLDialogElement | null>(null);

    // Register dialog shortcut
    useEffect(() => {
        shortcutStore.send({
            type: 'add',
            keyCode: '?',
            modifier: 'shift',
            description: 'Opens the shortcuts dialog',
            fn: () => dialog.current?.showModal(),
        });
        return () => shortcutStore.send({ type: 'remove', keyCode: '?' });
    }, []);

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
            kbShortcuts
                .find((shortcut) => {
                    let matches = shortcut.keyCode.toLowerCase() === event.key.toLowerCase();

                    if (shortcut.modifier === 'shift') {
                        matches = matches && event.shiftKey;
                    }

                    return matches;
                })
                ?.fn?.();
        };

        document.addEventListener('keyup', handleKeyPress);
        return () => document.removeEventListener('keyup', handleKeyPress);
    }, [dialog, kbShortcuts]);

    return (
        <dialog ref={dialog}>
            <button onClick={() => dialog.current?.close()} autoFocus>
                Close
            </button>
            <dl>
                {kbShortcuts
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

const Shortcut = ({ shortcut }: { shortcut: ShortcutObj }) => {
    return (
        <>
            <dt>
                {shortcut.modifier && (
                    <>
                        <span className={styles.key}>{shortcut.modifier}</span>
                        {' + '}
                    </>
                )}
                <span className={styles.key}>{shortcut.keyCode}</span>
            </dt>
            <dd>{shortcut.description}</dd>
        </>
    );
};
