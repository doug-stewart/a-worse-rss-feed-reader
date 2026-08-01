import { Link, useSearch } from "@tanstack/react-router";
import clsx from "clsx";

import type { Feed } from "../../types";

import styles from "./NavFeed.module.css";

export const NavFeed = ({ feed }: { feed: Feed }) => {
  const searchParams = useSearch({ strict: false });
  const unreadCount = 0;

  return (
    <li
      className={clsx(styles.feed, searchParams.feed?.includes(feed.id) && styles.active)}
      key={feed.id}
    >
      <Link search={{ feed: [feed.id] }} to="/feeds">
        <span>{feed.name}</span>
        <span>({unreadCount})</span>
      </Link>
    </li>
  );
};
