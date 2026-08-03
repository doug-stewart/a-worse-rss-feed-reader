import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import type { LayoutConsts } from "@/types";
import { useFeeds } from "../../hooks/useFeeds";
import type { Article } from "../../types";
import styles from "./ArticleCard.module.css";
import { Content } from "./Content";

type ArticleCardProps = {
  article: Article;
  layout: LayoutConsts;
  onRead: (id: number) => void;
};

export const ArticleCard = ({ article, layout, onRead }: ArticleCardProps) => {
  const { url, title, published_at, cover, body, summary } = article || {};

  const { feeds } = useFeeds();
  const parent = feeds.find((feed) => feed.id === article.feed_id)?.name || null;

  const wrapper = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);
  const [isRead, setIsRead] = useState(article.viewed || false);
  const [isVisible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!wrapper.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const onScreen = entry.isIntersecting;
        setVisible(onScreen);

        if (!onScreen) {
          setHeight(wrapper.current?.clientHeight || 0);
        }

        // IntersectionObserver fires when the card is partially off the screen
        // and we only want to count when it's fully off the screen.
        if (!article.viewed && !onScreen && entry.boundingClientRect.top <= 0) {
          setIsRead(true);
          onRead(article.id);
        }
      },
      {
        threshold: 0,
        // Use excessive bottom scroll margin to give us time
        // to conditionally load additional assets.
        rootMargin: "0px 0px 3000px 0px",
      },
    );

    observer.observe(wrapper.current);

    return () => observer.disconnect();
  }, [onRead, article.id, article.viewed]);

  return (
    <article
      className={clsx(
        styles.article,
        styles[layout],
        isRead && styles.read,
        !isVisible && styles.loading,
      )}
      ref={wrapper}
      style={{ ["--h" as string]: isVisible ? false : `${height}px` }}
    >
      {
        isVisible ? (
          <Content
            body={body}
            cover={cover ?? ""}
            date={published_at}
            layout={layout}
            onRead={() => onRead(article.id)}
            parent={parent}
            summary={summary || ""}
            title={title}
            url={url}
          />
        ) : null
        // <Skeleton layout={layout} />
      }
    </article>
  );
};
