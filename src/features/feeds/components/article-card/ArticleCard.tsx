import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import type { LayoutConsts } from "@/types";
import type { Article } from "../../types";
import styles from "./ArticleCard.module.css";
import { Content } from "./Content";

type ArticleCardProps = {
  article: Article;
  layout: LayoutConsts;
  parent: string;
  onRead: (id: string) => void;
};

export const ArticleCard = ({ article, layout, parent, onRead }: ArticleCardProps) => {
  const { url = "", title = "", date = 0, cover = "", body = "", summary = "" } = article || {};

  const [isRead, setIsRead] = useState(article.viewed || false);

  const wrapper = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);
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
  }, [onRead, article]);

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
            date={date}
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
