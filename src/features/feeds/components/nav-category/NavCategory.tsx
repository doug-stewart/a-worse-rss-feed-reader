import { Link, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';

import { useArticles } from '../../hooks/useArticles';
import type { CategoryObj, FeedObj } from '../../types';
import { NavFeed } from '../nav-feed/NavFeed';

import styles from './NavCategory.module.css';

import { useRead } from '@/features/user/stores/user.store';

export const NavCategory = ({
    category,
    feeds,
}: {
    category: CategoryObj;
    feeds: Array<FeedObj>;
}) => {
    const searchParams = useSearch({ strict: false });
    const articles = useArticles();
    const read = useRead();

    const articlesCount = feeds.reduce(
        (count, feed) =>
            count +
            articles.filter((article) => article.parent === feed.id && !read.includes(article.id))
                .length,
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
                    <NavFeed key={feed.id} feed={feed} />
                ))}
            </ol>
        </li>
    );
};
