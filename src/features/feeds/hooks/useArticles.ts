import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { ArticleObj } from '../types';

import { useFeeds } from './useFeeds';

import { fetchArticles } from '@/features/feeds/api/fetchArticles';
import { useRead } from '@/features/user/stores/user.store';

type OptionsOjb = {
    filter?: { category?: number; feed?: number; read?: boolean };
};

export const useArticles = (options?: OptionsOjb) => {
    const { filter } = options || {};

    const feeds = useFeeds();
    const read = useRead();

    const results = useQueries({
        queries: feeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticles(feed),
        })),
    });

    const memoizedArticles = useMemo(() => {
        let filtered: Array<ArticleObj> = [];

        if (results.some((result) => result.data !== undefined)) {
            filtered = results
                .filter((result) => result.data !== undefined)
                .map((result) => result.data)
                .flat()
                .sort((articleA, articleB) => articleB.date - articleA.date);
        }

        if (filter?.read === false) {
            filtered = filtered.filter((article) => !read.includes(article.id));
        }

        if (typeof filter?.category === 'number') {
            filtered = filtered.filter((article) => {
                const feed = feeds.find((f) => f.id === article.parent);
                return feed?.category === filter.category;
            });
        }

        if (typeof filter?.feed === 'number') {
            filtered = filtered.filter((article) => article.parent === filter.feed);
        }

        return filtered;
    }, [results, feeds, filter, read]);

    return { articles: memoizedArticles };
};
