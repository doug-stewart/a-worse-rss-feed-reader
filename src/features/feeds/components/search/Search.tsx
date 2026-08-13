import { useHotkey } from "@tanstack/react-hotkeys";
import { useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/dialog/Dialog";
import { useDialog } from "@/hooks/useDialog";
import { useCategories } from "../../hooks/useCategories";
import { useFeeds } from "../../hooks/useFeeds";
import { SearchItem } from "../search-item/SearchItem";
import styles from "./Search.module.css";

export const Search = () => {
  const navigate = useNavigate();

  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const { feeds } = useFeeds();
  const { categories } = useCategories();

  const { dialogRef, openDialog, closeDialog, isOpen } = useDialog();
  useHotkey({ key: "f" }, openDialog);

  const feedsSearch = new Fuse(feeds, {
    keys: ["name", "website"],
    threshold: 0.2,
  });

  const categoreiesSearch = new Fuse(categories, {
    keys: ["name"],
    threshold: 0.2,
  });

  const feedsResults = search ? feedsSearch.search(search).map((r) => r.item) : feeds;

  const categoriesResults = search
    ? categoreiesSearch.search(search).map((r) => r.item)
    : categories;

  const categoryFeedResults = feeds.filter(
    (feed) =>
      feedsResults.map((f) => f.id).includes(feed.id) === false &&
      categoriesResults.map((c) => c.id).includes(feed.category || -1),
  );

  const searchIndex = [
    ...categoriesResults.map((c) => `category-${c.id}`),
    ...feedsResults.map((f) => `feed-${f.id}`),
    ...categoryFeedResults.map((f) => `category-feed-${f.id}`),
  ];

  const onInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closeDialog();
      setSearch("");
      setSelected("");
    }

    if (event.key === "Enter" && selected) {
      let search = {};
      const [type, id] = selected.split("-");
      if (type === "category") {
        search = { category: [parseInt(id, 10)] };
      } else {
        search = { feed: [parseInt(id, 10)] };
      }
      navigate({ to: "/feeds", search });
      closeDialog();
      setSearch("");
      setSelected("");
    }

    if (event.key === "ArrowDown") {
      const currentIndex = searchIndex.indexOf(selected);
      const nextIndex = (currentIndex + 1) % searchIndex.length;
      setSelected(searchIndex[nextIndex]);
    }

    if (event.key === "ArrowUp") {
      const currentIndex = searchIndex.indexOf(selected);
      const nextIndex = (currentIndex - 1 + searchIndex.length) % searchIndex.length;
      setSelected(searchIndex[nextIndex]);
    }
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setSelected("");
  };

  useEffect(() => {
    if (selected) {
      const element = document.querySelector(`.${styles.results} .${styles.selected}`);
      element?.scrollIntoView({ block: "nearest" });
    }
  }, [selected]);

  useEffect(() => {
    if (isOpen) {
      input.current?.focus();
    }
  }, [isOpen]);

  return (
    <Dialog className={styles.wrapper} dialogRef={dialogRef}>
      <input
        className={styles.input}
        onChange={onSearch}
        onKeyDown={onInput}
        placeholder="Search..."
        ref={input}
        type="search"
      />
      <div className={styles.results}>
        <ol>
          {categoriesResults.map((category) => (
            <SearchItem
              id={category.id}
              key={category.id}
              name={category.name}
              onClick={closeDialog}
              selected={selected === `category-${category.id}`}
              type="category"
            />
          ))}
        </ol>
        <ol>
          {feedsResults.map((feed) => (
            <SearchItem
              id={feed.id}
              key={feed.id}
              name={feed.name}
              onClick={closeDialog}
              selected={selected === `feed-${feed.id}`}
              type="feed"
            />
          ))}
          {categoryFeedResults.map((feed) => (
            <SearchItem
              id={feed.id}
              key={feed.id}
              name={feed.name}
              onClick={closeDialog}
              selected={selected === `category-feed-${feed.id}`}
              type="feed"
            />
          ))}
        </ol>
      </div>
    </Dialog>
  );
};
