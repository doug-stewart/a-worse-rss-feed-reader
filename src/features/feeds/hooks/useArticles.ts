import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useFeeds } from './useFeeds';

import { fetchArticles } from '@/features/feeds/api/fetchArticles';
import { useRead } from '@/features/user/stores/user.store';

type OptionsOjb = {
    category?: Array<number>;
    feed?: Array<number>;
    read?: boolean;
};

export const useArticles = (options?: OptionsOjb) => {
    const {
        category: categoryFilter = [],
        feed: feedFilter = [],
        read: includeRead = false,
    } = options || {};

    const optionsStringified = JSON.stringify(options);

    const { feeds } = useFeeds();
    const read = useRead();

    const [refreshSnapshot, setRefreshSnapshot] = useState(true);
    const [readSnapshot, setReadSnapshot] = useState(read);
    const [optionsSnapshot, setOptionsSnapshot] = useState('');

    if (refreshSnapshot || optionsSnapshot !== optionsStringified) {
        setReadSnapshot(read);
        setRefreshSnapshot(false);
        setOptionsSnapshot(optionsStringified);
    }

    const filteredFeeds = feeds.filter((feed) => {
        if (categoryFilter.length > 0) {
            return categoryFilter.includes(feed.category);
        }
        if (feedFilter.length > 0) {
            return feedFilter.includes(feed.id);
        }
        return true;
    });

    const queryResults = useQueries({
        queries: filteredFeeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticles(feed),
        })),
        combine: (results) => {
            return {
                data: results.map((result) => result),
                isPending: results.some((result) => result.isPending),
                pending: results.filter((result) => result.isPending).length,
                total: results.length,
            };
        },
    });

    const collatedArticles = useMemo(() => {
        const articles = queryResults.data.flatMap((result) => result.data ?? []);
        return articles;
    }, [queryResults]);

    const displayArticles = collatedArticles
        .filter((article) =>
            includeRead === false ? readSnapshot.includes(article.id) === false : true,
        )
        .sort((articleA, articleB) => articleB.date - articleA.date);

    const unreadCount = collatedArticles.filter(
        (article) => read.includes(article.id) === false,
    ).length;

    const refreshArticles = () => {
        setRefreshSnapshot(true);
        const promises = queryResults.data.map((result) => result.refetch());
        return Promise.all(promises);
    };

    return {
        articles: displayArticles,
        unreadCount,
        refreshArticles,
        query: queryResults,
    };
};
