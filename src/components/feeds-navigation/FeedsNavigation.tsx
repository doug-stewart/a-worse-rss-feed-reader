import { useSelector } from '@xstate/store/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';

import styles from './FeedsNavigation.module.css';

import { feedStore } from '@/stores/feed.store';

export const FeedsNavigation = ({ className }: { className: string }) => {
    const articles = useSelector(feedStore, (state) => state.context.articles);
    const categories = useSelector(feedStore, (state) => state.context.categories);
    const feeds = useSelector(feedStore, (state) => state.context.feeds);

    return (
        <nav className={clsx(styles.menu, className)}>
            <h2>Main Navigation</h2>
            <ol>
                <li>
                    <strong>
                        <a href="#">All</a>
                    </strong>
                </li>
                <li>
                    <strong>
                        <a href="#">Today</a>
                    </strong>
                </li>
            </ol>
            <h3>Categories</h3>
            <ol>
                {categories.map((category) => (
                    <li key={category.id}>
                        <strong>
                            <a
                                href="#"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(category.name),
                                }}
                            />
                        </strong>
                        <ol>
                            {feeds
                                .filter((feed) => feed.category === category.id)
                                .map((feed) => (
                                    <li key={feed.id}>
                                        <a href="#">
                                            {feed.title} (
                                            {
                                                articles.filter(
                                                    (article) => article.parent === feed.id,
                                                ).length
                                            }
                                            )
                                        </a>
                                    </li>
                                ))}
                        </ol>
                    </li>
                ))}
            </ol>
            <footer className={styles.footer}>
                <a href="#">Add Feed</a>
                <a href="#">Settings</a>
            </footer>
        </nav>
    );
};
