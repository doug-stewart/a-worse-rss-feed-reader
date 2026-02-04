import { Link, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';

import { useArticles } from '../../hooks/useArticles';
import type { FeedObj } from '../../types';

import styles from './NavFeed.module.css';

export const NavFeed = ({ feed }: { feed: FeedObj }) => {
    const searchParams = useSearch({ strict: false });
    const { articles } = useArticles({ filter: { feed: feed.id, read: false } });
    const articlesCount = articles.length;

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
