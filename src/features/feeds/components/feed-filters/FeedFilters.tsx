import { useNavigate, useSearch } from '@tanstack/react-router';

import { useCategories } from '../../hooks/useCategories';
import { useFeeds } from '../../hooks/useFeeds';
import { FeedFilterList } from '../feed-filter-list/FeedFilterList';

import styles from './FeedFilters.module.css';

import CategoryIcon from '@/assets/category.svg?react';
import FeedIcon from '@/assets/feed.svg?react';

export const FeedFilters = () => {
    const { category: searchCategory = [], feed: searchFeed = [] } = useSearch({ strict: false });
    const { categories } = useCategories();
    const { feeds } = useFeeds();
    const navigate = useNavigate();

    const clearCategories = () => {
        const newParams = {};

        if (searchFeed.length > 0) {
            Object.assign(newParams, { feed: searchFeed });
        }

        navigate({ to: '/feeds', search: newParams });
    };

    const clearFeeds = () => {
        const newParams = {};

        if (searchCategory.length > 0) {
            Object.assign(newParams, { category: searchCategory });
        }

        navigate({ to: '/feeds', search: newParams });
    };

    const toggleCategory = (id: number) => {
        const updated = [
            ...(searchCategory.includes(id)
                ? searchCategory.filter((entry) => entry !== id)
                : [...searchCategory, id]),
        ];
        const newParams = {};

        if (updated.length > 0) {
            Object.assign(newParams, { category: updated });
        }

        if (searchFeed.length > 0) {
            Object.assign(newParams, { feed: searchFeed });
        }

        navigate({ to: '/feeds', search: newParams });
    };

    const toggleFeed = (id: number) => {
        const updated = [
            ...(searchFeed.includes(id)
                ? searchFeed.filter((entry) => entry !== id)
                : [...searchFeed, id]),
        ];
        const newParams = {};

        if (updated.length > 0) {
            Object.assign(newParams, { feed: updated });
        }

        if (searchCategory.length > 0) {
            Object.assign(newParams, { category: searchCategory });
        }

        navigate({ to: '/feeds', search: newParams });
    };

    const collatedCategories = categories
        .sort((a, b) => a.text.localeCompare(b.text))
        .map((category) => ({
            id: category.id,
            title: category.text,
            checked: searchCategory.includes(category.id),
        }));

    const collatedFeeds = feeds
        .filter((feed) => {
            if (searchCategory.length > 0) {
                return searchCategory.includes(feed.category);
            }
            return true;
        })
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((feed) => ({
            id: feed.id,
            title: feed.title,
            checked: searchFeed.includes(feed.id),
        }));

    return (
        <form className={styles.form}>
            <FeedFilterList
                label={<CategoryIcon title="Categories" />}
                count={searchCategory.length}
                items={collatedCategories}
                onClear={clearCategories}
                onToggle={toggleCategory}
            />
            <FeedFilterList
                label={<FeedIcon title="Feeds" />}
                count={searchFeed.length}
                items={collatedFeeds}
                onClear={clearFeeds}
                onToggle={toggleFeed}
            />
        </form>
    );
};
