import { useSearch, Link } from '@tanstack/react-router';
import { useSelector } from '@xstate/store/react';
import clsx from 'clsx';
import { useState } from 'react';

import styles from './FeedsNavigation.module.css';

import { useArticles } from '@/hooks/useArticles';
import { useFeeds } from '@/hooks/useFeeds';
import { useSettings } from '@/hooks/useSettings';
import { userStore } from '@/stores/user.store';
import type { CategoryObj, FeedObj } from '@/types';

export const FeedsNavigation = ({ className }: { className: string }) => {
    const { categories, categoryOrder } = useSettings();
    const feeds = useFeeds();

    return (
        <nav className={clsx(styles.menu, className)}>
            <h2>Main Navigation</h2>
            <ol>
                <li>
                    <strong>
                        <Link to="/feeds">All</Link>
                    </strong>
                </li>
                <li>
                    <strong>
                        <Link to="/feeds" search={{ range: 'today' }}>
                            Today
                        </Link>
                    </strong>
                </li>
                <li>
                    <strong>
                        <Link to="/feeds" search={{ range: 'week' }}>
                            Last Week
                        </Link>
                    </strong>
                </li>
            </ol>
            <h3>Categories</h3>
            <ol>
                {categories
                    .sort((catA, catB) => {
                        const indexA = categoryOrder.indexOf(catA.id);
                        const indexB = categoryOrder.indexOf(catB.id);
                        return indexA - indexB;
                    })
                    .map((category) => (
                        <NavigationCategory
                            category={category}
                            feeds={feeds.filter((feed) => feed.category === category.id)}
                            key={category.id}
                        />
                    ))}
            </ol>
            <footer className={styles.footer}>
                <a href="#">Add Feed</a>
                <a href="#">Settings</a>
            </footer>
        </nav>
    );
};

const NavigationCategory = ({
    category,
    feeds,
}: {
    category: CategoryObj;
    feeds: Array<FeedObj>;
}) => {
    const searchParams = useSearch({ strict: false });
    const articles = useArticles();

    const readArticles = useSelector(userStore, (state) => state.context.read);

    const articlesCount = feeds.reduce(
        (count, feed) =>
            count +
            articles.filter(
                (article) => article.parent === feed.id && !readArticles.includes(article.id),
            ).length,
        0,
    );

    const [open, setOpen] = useState(false);

    const toggleFeeds = () => setOpen(!open);

    return (
        <li key={category.id}>
            <strong>
                <Link
                    className={clsx(
                        styles.category,
                        searchParams.category === category.id && styles.active,
                    )}
                    to="/feeds"
                    search={{ category: category.id }}
                >
                    <span dangerouslySetInnerHTML={{ __html: category.text }} />
                    <span>({articlesCount})</span>
                </Link>
                <button onClick={toggleFeeds}>{open ? '-' : '+'}</button>
            </strong>
            <ol className={clsx(styles.feeds, !open && styles.hidden)}>
                {feeds.map((feed) => (
                    <NavigationFeed key={feed.id} feed={feed} />
                ))}
            </ol>
        </li>
    );
};

const NavigationFeed = ({ feed }: { feed: FeedObj }) => {
    const searchParams = useSearch({ strict: false });
    const articles = useArticles();

    const readArticles = useSelector(userStore, (state) => state.context.read);

    const articlesCount = articles.filter(
        (article) => article.parent === feed.id && !readArticles.includes(article.id),
    ).length;

    return (
        <li
            key={feed.id}
            className={clsx(styles.feed, searchParams.feed === feed.id && styles.active)}
        >
            <Link to="/feeds" search={{ feed: feed.id }}>
                <span dangerouslySetInnerHTML={{ __html: feed.title }} />
                <span>({articlesCount})</span>
            </Link>
        </li>
    );
};
