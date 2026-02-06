import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useFeeds } from './useFeeds';

import { fetchArticles } from '@/features/feeds/api/fetchArticles';
import { useRead } from '@/features/user/stores/user.store';

type OptionsOjb = {
    category?: number;
    feed?: number;
    read?: boolean;
};

export const useArticles = (options?: OptionsOjb) => {
    const { category: categoryFilter, feed: feedFilter, read: includeRead = false } = options || {};

    const feeds = useFeeds();
    const read = useRead();

    const [prevFilters, setPrevFilters] = useState({ category: categoryFilter, feed: feedFilter });
    const [readSnapshot, setReadSnapshot] = useState(read);

    if (prevFilters.category !== categoryFilter || prevFilters.feed !== feedFilter) {
        setPrevFilters({ category: categoryFilter, feed: feedFilter });
        setReadSnapshot(read);
    }

    const filteredFeeds = feeds.filter((feed) => {
        if (typeof categoryFilter === 'number') {
            return feed.category === categoryFilter;
        }
        if (typeof feedFilter === 'number') {
            return feed.id === feedFilter;
        }
        return true;
    });

    const results = useQueries({
        queries: filteredFeeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticles(feed),
        })),
    });

    const collatedArticles = useMemo(() => {
        const articles = results.flatMap((result) => result.data ?? []);
        return articles;
    }, [results]);

    const displayArticles = collatedArticles
        .filter((article) =>
            includeRead === false ? readSnapshot.includes(article.id) === false : true,
        )
        .sort((articleA, articleB) => articleB.date - articleA.date);

    const unreadCount = collatedArticles.filter(
        (article) => read.includes(article.id) === false,
    ).length;

    return {
        articles: displayArticles,
        unreadCount,
        articlesQuery: results,
    };
};
