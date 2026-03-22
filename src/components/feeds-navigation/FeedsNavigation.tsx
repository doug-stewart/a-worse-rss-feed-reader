import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

import styles from './FeedsNavigation.module.css';

import { NavCategory } from '@/features/feeds/components/nav-category/NavCategory';
import { useCategories } from '@/features/feeds/hooks/useCategories';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';

export const FeedsNavigation = ({ className }: { className: string }) => {
    const { categories, categoryOrder } = useCategories();
    const { feeds } = useFeeds();

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
                        <NavCategory
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
