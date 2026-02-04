import styles from './ArticleCard.module.css';

import type { LayoutConsts } from '@/types';

type SkeletonProps = {
    layout: LayoutConsts;
};

export const Skeleton = ({ layout }: SkeletonProps) => {
    return (
        <>
            <span className={styles.title} />
            <span className={styles.date} />
            <span className={styles.category} />
            {layout === 'full' ? <></> : <span className={styles.cover} />}
            <span className={styles.summary} />
        </>
    );
};
