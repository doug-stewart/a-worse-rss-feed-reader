import clsx from "clsx";
import type { Article, ArticleListLayouts } from "../../types";
import { ArticleCard } from "../article-card/ArticleCard";
import styles from "./ArticleList.module.css";

type ArticleCardListProps = {
  articles: Array<Article>;
  layout: ArticleListLayouts;
  onRead: (id: number) => void;
  onAllUnread: () => void;
};

export const ArticleList = ({ articles, layout, onRead, onAllUnread }: ArticleCardListProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.list, styles[layout])}>
        {articles.map((article) => (
          <ArticleCard article={article} key={article.id} layout={layout} onRead={onRead} />
        ))}
        <footer className={styles.footer}>
          <p>You&rsquo;ve reached the end&hellip;</p>
          <button onClick={onAllUnread} type="button">
            Mark All Unseen
          </button>
        </footer>
      </div>
    </div>
  );
};
