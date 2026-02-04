import { useQueries } from '@tanstack/react-query';

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

    const filteredFeeds = feeds.filter((feed) => {
        if (typeof filter?.category === 'number') {
            return feed.category === filter.category;
        }
        if (typeof filter?.feed === 'number') {
            return feed.id === filter.feed;
        }
        return true;
    });

    const results = useQueries({
        queries: filteredFeeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticles(feed),
        })),
    });

    const unreadArticles = results
        .flatMap((result) => result.data ?? [])
        .filter((article) => read.includes(article.id) === false)
        .sort((articleA, articleB) => articleB.date - articleA.date);

    return { articles: unreadArticles, articlesQuery: results };
};
