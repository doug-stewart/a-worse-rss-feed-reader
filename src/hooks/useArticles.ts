import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useFeeds } from './useFeeds';

import { fetchArticle } from '@/helpers/fetchArticle';
import type { ArticleObj } from '@/types';

type OptionsOjb = {
    filter?: { category?: number; feed?: number };
};

export const useArticles = (options?: OptionsOjb) => {
    const { filter } = options || {};

    const feeds = useFeeds();
    const results = useQueries({
        queries: feeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticle(feed),
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

        if (typeof filter?.category === 'number') {
            filtered = filtered.filter((article) => {
                const feed = feeds.find((feed) => feed.id === article.parent);
                return feed?.category === filter.category;
            });
        }

        if (typeof filter?.feed === 'number') {
            filtered = filtered.filter((article) => article.parent === filter.feed);
        }

        return filtered;
    }, [results, feeds, filter]);

    return memoizedArticles;
};
