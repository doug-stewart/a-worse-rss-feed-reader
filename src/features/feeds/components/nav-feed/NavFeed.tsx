import { Link, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';

import { useArticles } from '../../hooks/useArticles';
import type { FeedObj } from '../../types';

import styles from './NavFeed.module.css';

export const NavFeed = ({ feed }: { feed: FeedObj }) => {
    const searchParams = useSearch({ strict: false });
    const { unreadCount } = useArticles({ feed: [feed.id] });

    return (
        <li
            key={feed.id}
            className={clsx(styles.feed, searchParams.feed?.includes(feed.id) && styles.active)}
        >
            <Link to="/feeds" search={{ feed: [feed.id] }}>
                <span dangerouslySetInnerHTML={{ __html: feed.title }} />
                <span>({unreadCount})</span>
            </Link>
        </li>
    );
};
