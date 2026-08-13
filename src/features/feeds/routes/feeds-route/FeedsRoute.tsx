import { Batcher } from "@tanstack/pacer";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import FullIcon from "@/assets/full.svg?react";
import GridIcon from "@/assets/grid.svg?react";
import ListIcon from "@/assets/list.svg?react";
import MarkAllIcon from "@/assets/mark-all.svg?react";
import RefreshIcon from "@/assets/refresh.svg?react";
import { ArticleList } from "@/features/feeds/components/article-list/ArticleList";
import { FeedFilters } from "@/features/feeds/components/feed-filters/FeedFilters";
import { useArticles } from "@/features/feeds/hooks/useArticles";
import { useCategories } from "@/features/feeds/hooks/useCategories";
import { useFeeds } from "@/features/feeds/hooks/useFeeds";
import { useTitle } from "@/hooks/useTitle";
import type { LayoutConsts } from "@/types";
import { Search } from "../../components/search/Search";
import { scrollMainToTop } from "../../helpers/scrollMainToTop";
import styles from "./FeedsRoute.module.css";

export const FeedsRoute = () => {
  const searchParams = useSearch({ from: "/feeds" });

  const { setTitle } = useTitle();
  const { feeds } = useFeeds();
  const { categories } = useCategories();

  const {
    articles,
    query: articlesQuery,
    markRead,
    markUnread,
    refetchArticles,
  } = useArticles(searchParams.feed, searchParams.category);

  const unreadCount = articles.filter((article) => !article.viewed).length;

  const [searchSnapshot, setSearchSnapshot] = useState("");
  const [articlesSnapshot, setArticlesSnapshot] = useState<Array<number>>([]);
  const [layout, setLayout] = useState<LayoutConsts>("card");

  if (searchSnapshot !== JSON.stringify(searchParams)) {
    setSearchSnapshot(JSON.stringify(searchParams));
    const ids = Array.from(articles).map(({ id }) => id);
    setArticlesSnapshot(ids);
    refetchArticles();
  }

  const refreshFeed = () => {
    scrollMainToTop();
    refetchArticles();
  };

  const categoryName = categories
    .filter((category) => searchParams.category?.includes(category.id))
    .map((category) => category.name)
    .join(", ");

  const feedName = feeds
    .filter((feed) => searchParams.feed?.includes(feed.id))
    .map((feed) => feed.name)
    .join(", ");

  const changeLayout = (newLayout: LayoutConsts) => setLayout(newLayout);

  const cycleLayout = () => {
    const layouts: Array<LayoutConsts> = ["row", "card", "full"];
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  };

  const pendingRead = useRef(
    new Batcher<number>(
      (ids) => {
        markRead.mutate(ids);
      },
      { wait: 100 },
    ),
  ).current;

  const handleMarkRead = useCallback(
    (id: number) => {
      pendingRead.addItem(id);
    },
    [pendingRead],
  );

  const handleMarkAllRead = async () => {
    const ids = Array.from(articles).map(({ id }) => id);
    setArticlesSnapshot(ids);
    const batchSize = 250;
    const batches = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      batches.push(ids.slice(i, i + batchSize));
    }
    for (const batch of batches) {
      await markRead.mutateAsync(batch);
    }
    scrollMainToTop();
    refetchArticles();
  };

  const handleMarkAllUnread = () => {
    markUnread.mutate(articlesSnapshot);
    scrollMainToTop();
    refetchArticles();
  };

  useHotkey({ key: "l" }, cycleLayout);
  useHotkey({ key: "r" }, refreshFeed);
  useHotkey({ key: "Backspace", shift: true }, handleMarkAllRead);

  useEffect(() => {
    const title = `${categoryName || feedName || "All Feeds"} (${unreadCount})`;
    setTitle(title);
  }, [setTitle, categoryName, feedName, unreadCount]);

  return (
    <>
      <Search />
      <header className={styles.header}>
        <FeedFilters />
        <div className={styles.controls}>
          <form className={styles.layouts}>
            <label className={clsx(styles.layout, layout === "row" && styles.active)}>
              <input
                checked={layout === "row"}
                name="layout"
                onChange={() => changeLayout("row")}
                type="radio"
              />
              <ListIcon title="Row" />
            </label>
            <label className={clsx(styles.layout, layout === "card" && styles.active)}>
              <input
                checked={layout === "card"}
                name="layout"
                onChange={() => changeLayout("card")}
                type="radio"
              />
              <GridIcon title="Card" />
            </label>
            <label className={clsx(styles.layout, layout === "full" && styles.active)}>
              <input
                checked={layout === "full"}
                name="layout"
                onChange={() => changeLayout("full")}
                type="radio"
              />
              <FullIcon title="Full" />
            </label>
          </form>
          <div className={styles.actions}>
            <button onClick={refetchArticles} type="button">
              <RefreshIcon title="Refresh Articles" />
            </button>
            <button onClick={handleMarkAllRead} type="button">
              <MarkAllIcon title="Mark All Read" />
            </button>
          </div>
        </div>
      </header>
      {articlesQuery.isFetching === true ? (
        <span>Fetching articles&hellip;</span>
      ) : (
        <ArticleList
          articles={articles}
          layout={layout}
          onAllUnread={handleMarkAllUnread}
          onRead={handleMarkRead}
        />
      )}
    </>
  );
};
