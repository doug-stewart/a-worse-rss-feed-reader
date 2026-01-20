import axios from 'axios';

import type { ArticleObj, FeedObj } from '../types';

import { MAX_ARTICLES } from '@/config';
import { parseArticle } from '@/features/feeds/helpers/parseArticle';

export const fetchArticles = async (feed: FeedObj): Promise<Array<ArticleObj>> => {
    const { data } = await axios.get(feed.rss);

    const rssParser = new DOMParser();
    const rssDoc = rssParser.parseFromString(data, 'text/xml');

    const rssDocDateNode = [
        ...rssDoc.getElementsByTagName('lastBuildDate'),
        ...rssDoc.getElementsByTagName('updated'),
        ...rssDoc.getElementsByTagName('pubDate'),
    ][0];

    const rssDocDate = new Date(rssDocDateNode.textContent || new Date()).getTime();

    const articles = [];

    if (feed.type === 'atom') {
        const rssRawItems = rssDoc.getElementsByTagName('entry');
        for (const rssRawItem of rssRawItems) {
            if (articles.length >= MAX_ARTICLES) break;
            articles.push(parseArticle(rssRawItem, rssDocDate, feed.id));
        }
    }

    if (feed.type === 'rss') {
        const rssRawItems = rssDoc.getElementsByTagName('item');
        for (const rssRawItem of rssRawItems) {
            if (articles.length >= MAX_ARTICLES) break;
            articles.push(parseArticle(rssRawItem, rssDocDate, feed.id));
        }
    }

    return articles;
};
