import clsx from "clsx";
import type { LayoutConsts } from "@/types";
import type { Article } from "../../types";
import { ArticleCard } from "../article-card/ArticleCard";
import styles from "./ArticleList.module.css";

type ArticleCardListProps = {
  articles: Array<Article>;
  layout: LayoutConsts;
  onRead: (id: string) => void;
  onAllUnread: () => void;
};

export const ArticleList = ({ articles, layout, onRead, onAllUnread }: ArticleCardListProps) => {
  return (
    <div className={clsx(styles.list, styles[layout])}>
      {articles.map((article) => (
        <ArticleCard
          article={article}
          key={article.id}
          layout={layout}
          onRead={onRead}
          parent="article-list"
        />
      ))}
      <footer className={styles.footer}>
        <p>You&rsquo;ve reached the end&hellip;</p>
        <button onClick={onAllUnread} type="button">
          Mark All Unseen
        </button>
      </footer>
    </div>
  );
};
