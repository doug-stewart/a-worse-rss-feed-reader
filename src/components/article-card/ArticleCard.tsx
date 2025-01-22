import clsx from 'clsx';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';

import styles from './ArticleCard.module.css';

import { useArticle } from '@/hooks/useArticle';
import { useFeeds } from '@/hooks/useFeeds';
import type { ArticleObj, LayoutConsts } from '@/types';

type ArticleCardProps = { article: ArticleObj; layout: LayoutConsts };

export const ArticleCard = ({ article, layout }: ArticleCardProps) => {
    const feeds = useFeeds();

    const wrapper = useRef<HTMLElement | null>(null);

    const [height, setHeight] = useState(0);
    const [visible, setVisible] = useState(false);
    const [read, setRead] = useState(false);

    const { url, title, date, cover, body, parent, summary } = useArticle(article, visible);

    const parentName = feeds.find((feed) => feed.id === parent)?.title || 'Orphan';

    useEffect(() => {
        if (!wrapper.current) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries.at(0);
            if (!entry) return;

            const onScreen = entry.isIntersecting;

            setRead(read || entry.boundingClientRect.top <= 0);
            setVisible(onScreen);

            if (!onScreen) setHeight(wrapper.current?.clientHeight || 0);
        });

        observer.observe(wrapper.current);

        return () => observer.disconnect && observer.disconnect();
    }, [read, wrapper]);

    return (
        <article
            ref={wrapper}
            className={clsx(styles.article, styles[layout], read && styles.read)}
            style={{ ['--h' as string]: visible ? false : `${height}px` }}
        >
            {visible && (
                <>
                    <h3 className={styles.title}>
                        <a href={url}>{title}</a>
                    </h3>

                    {date && (
                        <time
                            className={styles.date}
                            dateTime={`${dayjs(date).format('YYYY-MM-DD')}`}
                        >
                            {dayjs(date).format('MMM D, YYYY')}
                        </time>
                    )}

                    <p className={styles.category}>{parentName}</p>

                    {cover ? (
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
            )}
        </article>
    );
};
