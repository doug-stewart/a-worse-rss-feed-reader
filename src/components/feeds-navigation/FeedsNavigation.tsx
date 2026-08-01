import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { NavCategory } from "@/features/feeds/components/nav-category/NavCategory";
import { useCategories } from "@/features/feeds/hooks/useCategories";
import { useFeeds } from "@/features/feeds/hooks/useFeeds";
import styles from "./FeedsNavigation.module.css";

export const FeedsNavigation = ({ className }: { className: string }) => {
  const { categories } = useCategories();
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
            <Link search={{ range: "today" }} to="/feeds">
              Today
            </Link>
          </strong>
        </li>
        <li>
          <strong>
            <Link search={{ range: "week" }} to="/feeds">
              Last Week
            </Link>
          </strong>
        </li>
      </ol>
      <h3>Categories</h3>
      <ol>
        {categories.map((category) => (
          <NavCategory
            category={category}
            feeds={feeds.filter((feed) => feed.category === category.id)}
            key={category.id}
          />
        ))}
      </ol>
      <footer className={styles.footer}>
        <a href="#add">Add Feed</a>
        <a href="#settings">Settings</a>
      </footer>
    </nav>
  );
};
