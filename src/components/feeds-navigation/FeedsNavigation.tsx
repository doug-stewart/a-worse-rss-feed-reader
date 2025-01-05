import { Link } from '@tanstack/react-router';
import { useSelector } from '@xstate/store/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { useState } from 'react';

import styles from './FeedsNavigation.module.css';

import { feedStore } from '@/stores/feed.store';
import type { CategoryObj, FeedObj } from '@/types';

export const FeedsNavigation = ({ className }: { className: string }) => {
    const categories = useSelector(feedStore, (state) => state.context.categories);
    const feeds = useSelector(feedStore, (state) => state.context.feeds);

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
                {categories.map((category) => (
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
    const articles = useSelector(feedStore, (state) => state.context.articles);
    const articlesCount = feeds.reduce(
        (count, feed) => count + articles.filter((article) => article.parent === feed.id).length,
        0,
    );

    const [open, setOpen] = useState(false);

    const toggleFeeds = () => setOpen(!open);

    return (
        <li key={category.id}>
            <strong>
                <Link to="/feeds" search={{ category: category.id }}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(category.name),
                        }}
                    />
                    <span>({articlesCount})</span>
                </Link>
                <button onClick={toggleFeeds}>{open ? '-' : '+'}</button>
            </strong>
            {open && (
                <ol>
                    {feeds.map((feed) => (
                        <NavigationFeed key={feed.id} feed={feed} />
                    ))}
                </ol>
            )}
        </li>
    );
};

const NavigationFeed = ({ feed }: { feed: FeedObj }) => {
    const articles = useSelector(feedStore, (state) => state.context.articles);
    const articlesCount = articles.filter((article) => article.parent === feed.id).length;

    return (
        <li key={feed.id}>
            <Link to="/feeds" search={{ feed: feed.id }}>
                <span
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(feed.title),
                    }}
                />
                <span>({articlesCount})</span>
            </Link>
        </li>
    );
};
