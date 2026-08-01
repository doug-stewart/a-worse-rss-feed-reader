import type { ReactNode } from "react";

import styles from "./FeedFilterList.module.css";

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
        <input checked={count === 0} onChange={onClear} type="checkbox" />
        All
      </label>
      <div className={styles.items}>
        {items.map((item) => (
          <label className={styles.label} key={item.id}>
            <input checked={item.checked} onChange={() => onToggle(item.id)} type="checkbox" />
            <span>{item.title}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
