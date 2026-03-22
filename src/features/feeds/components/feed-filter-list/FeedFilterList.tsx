import type { ReactNode } from 'react';

import styles from './FeedFilterList.module.css';

type FeedFilterListProps = {
    label: string | ReactNode;
    items: Array<{ title: string; id: number; checked: boolean }>;
    count: number;
    onClear: () => void;
    onToggle: (id: number) => void;
};

export const FeedFilterList = ({ label, count, items, onClear, onToggle }: FeedFilterListProps) => {
    return (
        <fieldset className={styles.set}>
            <legend className={styles.title}>{label}</legend>
            <label className={styles.label}>
                <input type="checkbox" checked={count === 0} onChange={onClear} />
                All
            </label>
            <div className={styles.items}>
                {items.map((item) => (
                    <label key={item.id} className={styles.label}>
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => onToggle(item.id)}
                        />
                        <span dangerouslySetInnerHTML={{ __html: item.title }} />
                    </label>
                ))}
            </div>
        </fieldset>
    );
};
