import { useEffect } from 'react';

import styles from './App.module.css';
import { FeedArticleList } from './components/feed-article-list/FeedArticleList';
import { FeedsNavigation } from './components/feeds-navigation/FeedsNavigation';
import { parseFeedItem } from './helpers/parseFeedItem';
import { FeedObj } from './types';

import * as feedsData from '@/assets/feedsData.json';
import { feedStore } from '@/stores/feed.store';

const articleSortRegEx = /^([T|t]he |[A|a] |[A|a]n )/;

function App() {
    useEffect(() => {
        const initialize = async () => {
            const orderedCategories = feedsData.categories.sort((catA, catB) => {
                const indexA = feedsData.categoryOrder.indexOf(catA.id);
                const indexB = feedsData.categoryOrder.indexOf(catB.id);
                return indexA - indexB;
            });

            const sortedFeeds = (feedsData.feeds as Array<FeedObj>).sort((feedA, feedB) => {
                const titleA = feedA.title.replace(articleSortRegEx, '');
                const titleB = feedB.title.replace(articleSortRegEx, '');
                return titleA.localeCompare(titleB, 'en', { sensitivity: 'base' });
            });

            const articles = [];

            const promises = feedsData.feeds.map(async (feed) => ({
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

                const rssDocDate = new Date(
                    rssDoc.getElementsByTagName('lastBuildDate')[0]?.textContent || new Date(),
                ).getTime();

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

            feedStore.send({
                type: 'initialize',
                data: {
                    categoryOrder: feedsData.categoryOrder,
                    categories: orderedCategories,
                    feeds: sortedFeeds,
                    articles: articles,
                },
            });
        };

        initialize();
    }, []);

    return (
        <>
            <header className={styles.header}>
                <h1>What if your RSS feed reader was worse?</h1>
            </header>
            <FeedsNavigation className={styles.nav} />
            <main className={styles.main}>
                <FeedArticleList />
            </main>
        </>
    );
}

export default App;
