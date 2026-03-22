import { useNavigate, useSearch } from '@tanstack/react-router';

import { useCategories } from '../../hooks/useCategories';
import { useFeeds } from '../../hooks/useFeeds';

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

    const collatedFeeds = feeds
        .filter((feed) => {
            if (searchCategory.length > 0) {
                return searchCategory.includes(feed.category);
            }
            return true;
        })
        .sort((a, b) => a.title.localeCompare(b.title));

    return (
        <form className={styles.form}>
            <fieldset>
                <legend>
                    <CategoryIcon title="Categories" />
                </legend>
                <label>
                    <input
                        type="checkbox"
                        checked={searchCategory.length === 0}
                        onChange={clearCategories}
                    />
                    All
                </label>
                <div className={styles.items}>
                    {categories
                        .sort((a, b) => a.text.localeCompare(b.text))
                        .map((category) => (
                            <label key={category.id}>
                                <input
                                    type="checkbox"
                                    checked={searchCategory.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                />
                                <span dangerouslySetInnerHTML={{ __html: category.text }} />
                            </label>
                        ))}
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    <FeedIcon title="Feeds" />
                </legend>
                <label>
                    <input
                        type="checkbox"
                        checked={searchFeed.length === 0}
                        onChange={clearFeeds}
                    />
                    All
                </label>
                <div className={styles.items}>
                    {collatedFeeds.map((feed) => (
                        <label key={feed.id}>
                            <input
                                type="checkbox"
                                checked={searchFeed.includes(feed.id)}
                                onChange={() => toggleFeed(feed.id)}
                            />
                            <span dangerouslySetInnerHTML={{ __html: feed.title }} />
                        </label>
                    ))}
                </div>
            </fieldset>
        </form>
    );
};
