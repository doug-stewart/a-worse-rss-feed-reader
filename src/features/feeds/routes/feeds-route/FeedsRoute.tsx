import { Batcher } from "@tanstack/pacer";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useSearch } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
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
import type { LayoutConsts } from "@/types";
import { FeedImporter } from "../../components/feed-importer/FeedImporter";

export const FeedsRoute = () => {
  const searchParams = useSearch({ from: "/feeds" });

  const { feeds } = useFeeds();
  const { categories } = useCategories();

  const {
    articles,
    query: articlesQuery,
    markRead,
    markUnread,
  } = useArticles(searchParams.feed, searchParams.category);

  const refreshArticles = () => articlesQuery.refetch();
  const unreadCount = articles.filter((article) => !article.viewed).length;

  const [searchSnapshot, setSearchSnapshot] = useState("");
  const [articlesSnapshot, setArticlesSnapshot] = useState<Array<number>>([]);
  const [layout, setLayout] = useState<LayoutConsts>("card");

  if (searchSnapshot !== JSON.stringify(searchParams)) {
    setSearchSnapshot(JSON.stringify(searchParams));
    const ids = Array.from(articles).map(({ id }) => id);
    setArticlesSnapshot(ids);
  }

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

  const handleMarkAllRead = () => {
    const ids = Array.from(articles).map(({ id }) => id);
    setArticlesSnapshot(ids);
    markRead.mutate(ids);
    refreshArticles();
  };

  const handleMarkAllUnread = () => {
    markUnread.mutate(articlesSnapshot);
    refreshArticles();
  };

  useHotkey("Shift+L", cycleLayout);
  useHotkey("Shift+R", refreshArticles);
  useHotkey("Shift+Backspace", handleMarkAllRead);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <h2>
          <span>{categoryName || feedName || "All Feeds"}</span> ({unreadCount})
        </h2>
        <FeedFilters />
        <div>
          <button onClick={refreshArticles} type="button">
            <RefreshIcon title="Refresh Articles" />
          </button>
          <button onClick={handleMarkAllRead} type="button">
            <MarkAllIcon title="Mark All Read" />
          </button>
          <form>
            <label>
              <input
                checked={layout === "row"}
                name="layout"
                onChange={() => changeLayout("row")}
                type="radio"
              />
              <ListIcon title="Row" />
            </label>
            <label>
              <input
                checked={layout === "card"}
                name="layout"
                onChange={() => changeLayout("card")}
                type="radio"
              />
              <GridIcon title="Card" />
            </label>
            <label>
              <input
                checked={layout === "full"}
                name="layout"
                onChange={() => changeLayout("full")}
                type="radio"
              />
              <FullIcon title="Full" />
            </label>
          </form>
        </div>
      </header>
      {articlesQuery.isFetching === true && <span>Fetching articles&hellip;</span>}
      <FeedImporter />
      <ArticleList
        articles={articles}
        layout={layout}
        onAllUnread={handleMarkAllUnread}
        onRead={handleMarkRead}
      />
    </>
  );
};
