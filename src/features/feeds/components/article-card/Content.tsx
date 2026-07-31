import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import { useState } from 'react';

import styles from './ArticleCard.module.css';

import type { LayoutConsts } from '@/types';

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
                <a href={url} onClick={onRead} target="_blank">
                    {title}
                </a>
            </h3>

            {date && (
                <time className={styles.date} dateTime={`${dayjs(date).format('YYYY-MM-DD')}`}>
                    {dayjs(date).format('MMM D, YYYY')}
                </time>
            )}

            <p className={styles.category}>{parent}</p>

            {layout === 'full' ? (
                <></>
            ) : showImage && cover ? (
                <img
                    className={styles.cover}
                    src={cover}
                    alt={title}
                    onError={() => setShowImage(false)}
                />
            ) : (
                <span className={styles.cover} />
            )}

            {layout === 'full'
                ? summary && (
                      <p
                          className={styles.summary}
                          dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(body),
                          }}
                      />
                  )
                : summary && <p className={styles.summary}>{summary}</p>}
        </>
    );
};
