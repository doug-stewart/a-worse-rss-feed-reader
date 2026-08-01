import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { useState } from "react";
import type { LayoutConsts } from "@/types";
import styles from "./ArticleCard.module.css";

type ContentProps = {
  url: string;
  title: string;
  date: number;
  parent: string;
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

  return (
    <>
      <h3 className={styles.title}>
        <a href={url} onClick={onRead} rel="noopener" target="_blank">
          {title}
        </a>
      </h3>

      {date && (
        <time className={styles.date} dateTime={`${dayjs(date).format("YYYY-MM-DD")}`}>
          {dayjs(date).format("MMM D, YYYY")}
        </time>
      )}

      <p className={styles.category}>{parent}</p>

      {layout === "full" ? null : showImage && cover ? (
        <img alt={title} className={styles.cover} onError={() => setShowImage(false)} src={cover} />
      ) : (
        <span className={styles.cover} />
      )}

      {layout === "full"
        ? summary && (
            <p
              className={styles.summary}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(body),
              }}
            />
          )
        : summary && <p className={styles.summary}>{summary}</p>}
    </>
  );
};
