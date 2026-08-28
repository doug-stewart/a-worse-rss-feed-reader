import clsx from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import DOMPurify from "dompurify";
import { useLayoutEffect, useRef, useState } from "react";
import { useScrollContext } from "@/hooks/useScrollContext";
import { useArticles } from "../../hooks/useArticles";
import { useFeeds } from "../../hooks/useFeeds";
import type { Article, ArticleListLayouts } from "../../types";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  article: Article;
  layout: ArticleListLayouts;
  onRead: (id: number) => void;
};

export const ArticleCard = ({ article, layout, onRead }: ArticleCardProps) => {
  const { url, title, published_at, cover, body, summary } = article || {};

  const { feeds } = useFeeds();
  const { markRead, markUnread } = useArticles();
  const parent = feeds.find((feed) => feed.id === article.feed_id)?.name || null;

  const { root: scrollRoot } = useScrollContext();

  const wrapper = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);
  const [isRead, setIsRead] = useState(article.viewed || false);
  const [isVisible, setVisible] = useState(false);
  const [keepUnread, setKeepUnread] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const cleanSummary = DOMPurify.sanitize(summary, {
    RETURN_DOM: true,
  })?.textContent;
  const time = formatDistanceToNowStrict(new Date(published_at), {
    addSuffix: true,
  });

  const markArticleRead = () => {
    if (keepUnread) return;
    setIsRead(true);
    markRead.mutate([article.id]);
  };

  const markArticleUnread = () => {
    setIsRead(false);
    setKeepUnread(true);
    markUnread.mutate([article.id]);
  };

  const lockUnread = () => {
    if (isRead) {
      markUnread.mutate([article.id]);
      setIsRead(false);
    }
    setKeepUnread(true);
  };

  const unlockUnread = () => {
    setKeepUnread(false);
  };

  useLayoutEffect(() => {
    if (!wrapper.current || !scrollRoot) return;

    const handleRender = (entryies: Array<IntersectionObserverEntry>) => {
      const [entry] = entryies;
      const onScreen = entry.isIntersecting;
      setVisible(onScreen);
      if (!onScreen) {
        setHeight(wrapper.current?.clientHeight || 0);
      }
    };

    const handleRead = (entryies: Array<IntersectionObserverEntry>) => {
      const [entry] = entryies;
      const onScreen = entry.isIntersecting;

      if (
        keepUnread === false &&
        onScreen === false &&
        article.viewed === false &&
        entry.boundingClientRect.top <= 0
      ) {
        setIsRead(true);
        onRead(article.id);
      }
    };

    const renderObserver = new IntersectionObserver(handleRender, {
      root: scrollRoot,
      threshold: 0,
      rootMargin: "1000px 0px 1000px 0px",
    });

    const readObserver = new IntersectionObserver(handleRead, {
      root: scrollRoot,
      threshold: 0,
      rootMargin: "0px",
    });

    renderObserver.observe(wrapper.current);
    readObserver.observe(wrapper.current);

    return () => {
      renderObserver.disconnect();
      readObserver.disconnect();
    };
  }, [onRead, keepUnread, scrollRoot, article.id, article.viewed]);

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
      {isVisible ? (
        <>
          <h3 className={styles.title}>
            <a href={url} onClick={markArticleRead} rel="noopener" target="_blank">
              {title}
            </a>
          </h3>

          {["full", "card"].includes(layout) ? (
            <span className={styles.categoryTime}>
              <time className={styles.date} dateTime={published_at}>
                {time}
              </time>

              <span className={styles.category}>{parent}</span>
            </span>
          ) : (
            <>
              <time className={styles.date} dateTime={published_at}>
                {time}
              </time>
              <span className={styles.category}>{parent}</span>
            </>
          )}

          {layout === "full" ? null : showImage && cover ? (
            <img alt="" className={styles.cover} onError={() => setShowImage(false)} src={cover} />
          ) : (
            <span className={styles.cover} />
          )}

          {layout === "full" && body ? (
            <div
              className={styles.body}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(body),
              }}
            />
          ) : (
            cleanSummary && <p className={styles.summary}>{cleanSummary}</p>
          )}
          <menu className={styles.actions}>
            {isRead ? (
              <button disabled={keepUnread} onClick={markArticleUnread} type="button">
                Unread
              </button>
            ) : (
              <button disabled={keepUnread} onClick={markArticleRead} type="button">
                Read
              </button>
            )}
            {keepUnread ? (
              <button onClick={unlockUnread} type="button">
                Unlock
              </button>
            ) : (
              <button onClick={lockUnread} type="button">
                Lock
              </button>
            )}
          </menu>
        </>
      ) : (
        <>
          <div className={styles.cover} />
          <div className={styles.title} />
          <div className={styles.categoryTime} />
          <div className={styles.summary} />
        </>
      )}
    </article>
  );
};
