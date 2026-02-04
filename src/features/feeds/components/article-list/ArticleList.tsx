import clsx from 'clsx';

import type { ArticleObj } from '../../types';
import { ArticleCard } from '../article-card/ArticleCard';

import styles from './ArticleList.module.css';

import type { LayoutConsts } from '@/types';

type ArticleCardListProps = {
    articles: Array<ArticleObj>;
    layout: LayoutConsts;
    onRead: (id: string) => void;
};

export const ArticleList = ({ articles, layout, onRead }: ArticleCardListProps) => {
    return (
        <div className={clsx(styles.list, styles[layout])}>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} onRead={onRead} layout={layout} />
            ))}
            <footer className={styles.footer}>
                <p>You&rsquo;ve reached the end&hellip;</p>
                <button>Mark All Unseen</button>
            </footer>
        </div>
    );
};
