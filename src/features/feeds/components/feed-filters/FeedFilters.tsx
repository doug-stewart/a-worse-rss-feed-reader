import { useNavigate, useSearch } from "@tanstack/react-router";
import CategoryIcon from "@/assets/category.svg?react";
import FeedIcon from "@/assets/feed.svg?react";
import { useCategories } from "../../hooks/useCategories";
import { useFeeds } from "../../hooks/useFeeds";
import { FeedFilterList } from "../feed-filter-list/FeedFilterList";
import styles from "./FeedFilters.module.css";

export const FeedFilters = () => {
  const { category: searchCategory = [], feed: searchFeed = [] } = useSearch({
    strict: false,
  });
  const { categories } = useCategories();
  const { feeds } = useFeeds();
  const navigate = useNavigate();

  const clearCategories = () => {
    const newParams = {};

    if (searchFeed.length > 0) {
      Object.assign(newParams, { feed: searchFeed });
    }

    navigate({ to: "/feeds", search: newParams });
  };

  const clearFeeds = () => {
    const newParams = {};

    if (searchCategory.length > 0) {
      Object.assign(newParams, { category: searchCategory });
    }

    navigate({ to: "/feeds", search: newParams });
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

    navigate({ to: "/feeds", search: newParams });
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

    navigate({ to: "/feeds", search: newParams });
  };

  const collatedCategories = categories
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({
      id: category.id,
      title: category.name,
      checked: searchCategory.includes(category.id),
    }));

  const collatedFeeds = feeds
    .filter((feed) => {
      if (searchCategory.length > 0) {
        return searchCategory.includes(feed.category || -1);
      }
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((feed) => ({
      id: feed.id,
      title: feed.name,
      checked: searchFeed.includes(feed.id),
    }));

  return (
    <form className={styles.form}>
      <FeedFilterList
        count={searchCategory.length}
        items={collatedCategories}
        label={<CategoryIcon title="Categories" />}
        onClear={clearCategories}
        onToggle={toggleCategory}
      />
      <FeedFilterList
        count={searchFeed.length}
        items={collatedFeeds}
        label={<FeedIcon title="Feeds" />}
        onClear={clearFeeds}
        onToggle={toggleFeed}
      />
    </form>
  );
};
