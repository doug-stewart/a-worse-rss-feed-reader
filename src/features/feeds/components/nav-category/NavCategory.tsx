import { Link, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';

import { useArticles } from '../../hooks/useArticles';
import type { CategoryObj, FeedObj } from '../../types';
import { NavFeed } from '../nav-feed/NavFeed';

import styles from './NavCategory.module.css';

export const NavCategory = ({
    category,
    feeds,
}: {
    category: CategoryObj;
    feeds: Array<FeedObj>;
}) => {
    const searchParams = useSearch({ strict: false });

    const { articles } = useArticles({ filter: { category: category.id, read: false } });
    const articlesCount = articles.length;

    const [open, setOpen] = useState(false);
    const toggleFeeds = () => setOpen((current) => !current);

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
