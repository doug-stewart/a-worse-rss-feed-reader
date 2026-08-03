import { format } from "date-fns";
import DOMPurify from "dompurify";
import { useState } from "react";
import type { LayoutConsts } from "@/types";
import styles from "./ArticleCard.module.css";

type ContentProps = {
  url: string;
  title: string;
  date: string;
  parent: string | null;
  cover: string;
  body: string;
  summary: string;
  layout: LayoutConsts;
  onRead: () => void;
};

export const Content = ({
  url,
  title,
  date,
  parent,
  cover,
  body,
  layout,
  summary,
  onRead,
}: ContentProps) => {
  const [showImage, setShowImage] = useState(true);

  const cleanSummary = DOMPurify.sanitize(summary, { RETURN_DOM: true })?.textContent;

  return (
    <>
      <h3 className={styles.title}>
        <a href={url} onClick={onRead} rel="noopener" target="_blank">
          {title}
        </a>
      </h3>

      {Boolean(date) && (
        <time className={styles.date} dateTime={date}>
          {format(new Date(date), "MMM d, yyyy")}
        </time>
      )}

      {Boolean(parent) && <p className={styles.category}>{parent}</p>}

      {layout === "full" ? null : showImage && cover ? (
        <img alt={title} className={styles.cover} onError={() => setShowImage(false)} src={cover} />
      ) : (
        <span className={styles.cover} />
      )}

      {layout === "full"
        ? body && (
            <p
              className={styles.summary}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(body),
              }}
            />
          )
        : cleanSummary && <p className={styles.summary}>{cleanSummary}</p>}
    </>
  );
};
