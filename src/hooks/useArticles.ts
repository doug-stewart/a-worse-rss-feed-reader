import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

import { useFeeds } from './useFeeds';

import { parseArticle } from '@/helpers/parseArticle';
import type { ArticleObj, FeedObj } from '@/types';

const fetchArticleCards = async (feed: FeedObj): Promise<Array<ArticleObj>> => {
    const { data } = await axios.get(feed.rss);

    const rssParser = new DOMParser();
    const rssDoc = rssParser.parseFromString(data, 'text/xml');

    const rssDocDateNode =
        rssDoc.getElementsByTagName('lastBuildDate')[0] ||
        rssDoc.getElementsByTagName('updated')[0] ||
        rssDoc.getElementsByTagName('pubDate')[0];

    const rssDocDate = new Date(rssDocDateNode?.textContent || new Date()).getTime();

    const articles = [];

    if (feed.type === 'atom') {
        const rssRawItems = rssDoc.getElementsByTagName('entry');
        for (const rssRawItem of rssRawItems) {
            articles.push(parseArticle(rssRawItem, rssDocDate, feed.id));
        }
    }

    if (feed.type === 'rss') {
        const rssRawItems = rssDoc.getElementsByTagName('item');
        for (const rssRawItem of rssRawItems) {
            articles.push(parseArticle(rssRawItem, rssDocDate, feed.id));
        }
    }

    return articles;
};

export const useArticles = () => {
    const feeds = useFeeds();
    const results = useQueries({
        queries: feeds.map((feed) => ({
            queryKey: ['articles', feed.id],
            queryFn: () => fetchArticleCards(feed),
        })),
    });

    let articles: Array<ArticleObj> = [];

    if (results.some((result) => result.data !== undefined)) {
        articles = results
            .filter((result) => result.data !== undefined)
            .map((result) => result.data)
            .flat()
            .sort((articleA, articleB) => articleB.date - articleA.date);
    }

    return articles;
};
