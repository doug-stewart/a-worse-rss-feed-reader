import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

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
}: ContentProps) => {
    return (
        <>
            <h3 className={styles.title}>
                <a href={url}>{title}</a>
            </h3>

            {date && (
                <time className={styles.date} dateTime={`${dayjs(date).format('YYYY-MM-DD')}`}>
                    {dayjs(date).format('MMM D, YYYY')}
                </time>
            )}

            <p className={styles.category}>{parent}</p>

            {layout === 'full' ? (
                <></>
            ) : cover ? (
                <img className={styles.cover} src={cover} alt={title} />
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
