import clsx from 'clsx';

import styles from './ArticleList.module.css';

import { ArticleCard } from '@/components/article-card/ArticleCard';
import type { ArticleObj, LayoutConsts } from '@/types';

type ArticleCardListProps = {
    articles: Array<ArticleObj>;
    layout: LayoutConsts;
};

export const ArticleList = ({ articles, layout }: ArticleCardListProps) => {
    return (
        <div className={clsx(styles.list, styles[layout])}>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} layout={layout} />
            ))}
        </div>
    );
};
