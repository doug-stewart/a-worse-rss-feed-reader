import axios from 'axios';

import { MAX_ARTICLES } from '@/conig';
import { parseArticle } from '@/helpers/parseArticle';
import type { ArticleObj, FeedObj } from '@/types';

export const fetchArticle = async (feed: FeedObj): Promise<Array<ArticleObj>> => {
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
