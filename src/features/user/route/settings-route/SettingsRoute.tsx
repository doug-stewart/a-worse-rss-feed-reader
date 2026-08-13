import { useCategories } from "@/features/feeds/hooks/useCategories";
import { useFeeds } from "@/features/feeds/hooks/useFeeds";
import { FeedItem } from "../../components/feed-item/FeedItem";
import styles from "./SettingsRoute.module.css";

export const SettingsRoute = () => {
  const { categories } = useCategories();
  const { feeds } = useFeeds();

  return (
    <>
      <h2>Settings</h2>
      <section>
        <h3>Categories</h3>
        <ol className={styles.list}>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ol>
      </section>
      <section>
        <h3>Feeds</h3>
        <ol className={styles.list}>
          {feeds.map((feed) => (
            <FeedItem feed={feed} key={feed.id} />
          ))}
        </ol>
      </section>
    </>
  );
};
