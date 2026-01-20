import clsx from 'clsx';
import { customAlphabet } from 'nanoid';
import type { PropsWithChildren } from 'react';
import { Children, useEffect, useRef } from 'react';

import styles from './DropdownMenu.module.css';

type DropdownProps = PropsWithChildren<{
    button: string;
    className?: string;
}>;

export const DropdownMenu = ({ button, children, className }: DropdownProps) => {
    const id = customAlphabet('1234567890abcdef', 10)();
    const dialog = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!dialog.current) return;

        const el = dialog.current;
        el.addEventListener('click', (e) => {
            const wasButton = !!(e.target as HTMLElement).closest('button');
            if (wasButton) el.hidePopover();
        });

        return () => el.removeEventListener('click', () => {});
    }, []);

    return (
        <>
            <button
                popoverTarget={id}
                className={clsx(styles.button, className)}
                style={{ anchorName: `--${id}` } as React.CSSProperties}
            >
                {button}
            </button>
            <dialog
                ref={dialog}
                popover=""
                id={id}
                className={styles.menu}
                style={{ positionAnchor: `--${id}` } as React.CSSProperties}
            >
                <menu>
                    {Children.map(children, (child: any, index: number) => {
                        return <li key={index}>{child}</li>;
                    })}
                </menu>
            </dialog>
        </>
    );
};
