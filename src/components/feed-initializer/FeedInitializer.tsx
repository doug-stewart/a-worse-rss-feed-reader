// This is a temp file until there's a better flow for this.
import DOMPurify from 'dompurify';
import { useEffect } from 'react';

import * as feedsData from '@/assets/feedsData.json';
import { articleRegEx } from '@/helpers/articleRegEx';
import { parseFeedItem } from '@/helpers/parseFeedItem';
import { feedStore } from '@/stores/feed.store';
import type { FeedObj } from '@/types';

export const FeedInitializer = () => {
    useEffect(() => {
        const initialize = async () => {
            const { categories, categoryOrder, feeds } = feedsData;

            const collatedCategories = categories
                .map((category) => ({
                    ...category,
                    name: DOMPurify.sanitize(category.name),
                }))
                .sort((catA, catB) => {
                    const indexA = categoryOrder.indexOf(catA.id);
                    const indexB = categoryOrder.indexOf(catB.id);
                    return indexA - indexB;
                });

            const collatedFeeds = feeds
                .map((feed) => ({
                    ...feed,
                    title: DOMPurify.sanitize(feed.title),
                }))
                .sort((feedA, feedB) => {
                    const titleA = feedA.title.replace(articleRegEx, '');
                    const titleB = feedB.title.replace(articleRegEx, '');
                    return titleA.localeCompare(titleB, 'en', { sensitivity: 'base' });
                }) as Array<FeedObj>;

            let articles = [];

            const promises = collatedFeeds.map(async (feed) => ({
                id: feed.id,
                type: feed.type,
                body: await fetch(feed.rss).then((response) => response.text()),
            }));

            const results = await Promise.allSettled(promises).then((response) =>
                response
                    .filter((result) => result.status === 'fulfilled')
                    .map((result) => result.value),
            );

            for (const feed of results) {
                const rssParser = new DOMParser();
                const rssDoc = rssParser.parseFromString(feed.body, 'text/xml');

                const rssDocDateNode =
                    rssDoc.getElementsByTagName('lastBuildDate')[0] ||
                    rssDoc.getElementsByTagName('updated')[0] ||
                    rssDoc.getElementsByTagName('pubDate')[0];
                const rssDocDate = new Date(rssDocDateNode?.textContent || new Date()).getTime();

                if (feed.type === 'atom') {
                    const rssRawItems = rssDoc.getElementsByTagName('entry');
                    for (const rssRawItem of rssRawItems) {
                        articles.push(parseFeedItem(rssRawItem, rssDocDate, feed.id));
                    }
                }

                if (feed.type === 'rss') {
                    const rssRawItems = rssDoc.getElementsByTagName('item');
                    for (const rssRawItem of rssRawItems) {
                        articles.push(parseFeedItem(rssRawItem, rssDocDate, feed.id));
                    }
                }
            }

            articles = articles.sort((articleA, articleB) => articleB.date - articleA.date);

            feedStore.send({
                type: 'initialize',
                data: {
                    categoryOrder: feedsData.categoryOrder,
                    categories: collatedCategories,
                    feeds: collatedFeeds,
                    articles: articles,
                },
            });
        };

        initialize();
    }, []);

    return <></>;
};
