import { useSelector } from '@xstate/store/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import styles from './FeedArticle.module.css';

import { feedStore } from '@/stores/feed.store';
import type { FeedArticleObj, LayoutConsts } from '@/types';

type FeedArticleProps = { article: FeedArticleObj; layout: LayoutConsts };

export const FeedArticle = ({ article, layout }: FeedArticleProps) => {
    const { parent, title, url, date, cover, summary } = article;

    const wrapper = useRef<HTMLElement | null>(null);

    const [height, setHeight] = useState(0);
    const [visible, setVisible] = useState(false);
    const [read, setRead] = useState(false);

    const categories = useSelector(feedStore, (state) => state.context.feeds);
    const parentName = categories.find((category) => category.id === parent)?.title || 'Orphan';

    useEffect(() => {
        if (!wrapper.current) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries.at(0);
            if (!entry) return;

            const onScreen = entry.isIntersecting;

            setRead(entry.boundingClientRect.top <= 0);
            setVisible(onScreen);

            if (!onScreen) setHeight(wrapper.current?.clientHeight || 0);
        });

        observer.observe(wrapper.current);

        return () => observer.disconnect && observer.disconnect();
    }, [wrapper]);

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

                    {summary && <p className={styles.summary}>{summary}</p>}
                </>
            )}
        </article>
    );
};
