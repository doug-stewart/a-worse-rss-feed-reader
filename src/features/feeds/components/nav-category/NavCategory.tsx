import { Link, useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";

import type { Category, Feed } from "../../types";
import { NavFeed } from "../nav-feed/NavFeed";

import styles from "./NavCategory.module.css";

export const NavCategory = ({ category, feeds }: { category: Category; feeds: Array<Feed> }) => {
  const searchParams = useSearch({ strict: false });
  const unreadCount = 0;
  const [open, setOpen] = useState(false);
  const toggleFeeds = () => setOpen((current) => !current);

  return (
    <li>
      <strong>
        <Link
          className={clsx(
            styles.category,
            searchParams.category?.includes(category.id) && styles.active,
          )}
          search={{ category: [category.id] }}
          to="/feeds"
        >
          <span>{category.name}</span>
          <span>({unreadCount})</span>
        </Link>
        <button onClick={toggleFeeds} type="button">
          {open ? "-" : "+"}
        </button>
      </strong>
      <ol className={clsx(styles.feeds, !open && styles.hidden)}>
        {feeds.map((feed) => (
          <NavFeed feed={feed} key={feed.id} />
        ))}
      </ol>
    </li>
  );
};
