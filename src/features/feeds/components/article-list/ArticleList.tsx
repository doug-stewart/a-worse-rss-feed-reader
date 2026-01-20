import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import styles from './ArticleList.module.css';

import type { LayoutConsts } from '@/types';

type ArticleCardListProps = PropsWithChildren<{
    layout: LayoutConsts;
}>;

export const ArticleList = ({ children, layout }: ArticleCardListProps) => {
    return (
        <div className={clsx(styles.list, styles[layout])}>
            {children}
            <footer className={styles.footer}>
                <p>You&rsquo;ve reached the end&hellip;</p>
                <button>Mark All Unseen</button>
            </footer>
        </div>
    );
};
