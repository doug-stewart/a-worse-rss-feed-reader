import type { ShortcutObj } from '../../types';

import styles from './Shortcut.module.css';

export const Shortcut = ({ shortcut }: { shortcut: ShortcutObj }) => {
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
