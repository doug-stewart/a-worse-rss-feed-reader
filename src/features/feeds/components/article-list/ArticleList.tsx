import { useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import type { ArticleObj } from '../../types';
import { ArticleCard } from '../article-card/ArticleCard';

import styles from './ArticleList.module.css';

import { useUserActions } from '@/features/user/stores/user.store';
import type { LayoutConsts } from '@/types';

type ArticleCardListProps = {
    articles: Array<ArticleObj>;
    layout: LayoutConsts;
    onRead: (id: string) => void;
};

export const ArticleList = ({ articles, layout, onRead }: ArticleCardListProps) => {
    const { markUnread } = useUserActions();
    const list = useRef<HTMLDivElement>(null);

    const searchParams = useSearch({ from: '/feeds' });

    useEffect(() => {
        list.current?.parentElement?.scrollTo(0, 0);
    }, [searchParams]);

    const handleMarkAllUnread = () => {
        markUnread(articles.map(({ id }) => id));
    };

    return (
        <div ref={list} className={clsx(styles.list, styles[layout])}>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} onRead={onRead} layout={layout} />
            ))}
            <footer className={styles.footer}>
                <p>You&rsquo;ve reached the end&hellip;</p>
                <button onClick={handleMarkAllUnread}>Mark All Unseen</button>
            </footer>
        </div>
    );
};
