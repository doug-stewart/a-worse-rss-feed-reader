import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { ArticleObj } from '../../types';

import styles from './ArticleCard.module.css';
import { Content } from './Content';

import { useArticle } from '@/features/feeds/hooks/useArticle';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';
import type { LayoutConsts } from '@/types';

type ArticleCardProps = {
    article: ArticleObj;
    layout: LayoutConsts;
    read: boolean;
    callback: (id: string) => void;
};

export const ArticleCard = ({ article, layout, read, callback }: ArticleCardProps) => {
    const wrapper = useRef<HTMLElement | null>(null);

    const [height, setHeight] = useState(0);
    const [visible, setVisible] = useState(false);

    const feeds = useFeeds();
    const { data, isSuccess } = useArticle(article, visible);

    const { url = '', title = '', date = 0, cover = '', body = '', summary = '' } = data || {};
    const parent = feeds.find((feed) => feed.id === article.parent)?.title || 'Orphan';

    useEffect(() => {
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
                if (!read && !onScreen && entry.boundingClientRect.top <= 0) {
                    callback(article.id);
                }
            },
            {
                threshold: 0,
                // Use excessive bottom scroll margin to give us time
                // to conditionally load additional assets.
                rootMargin: '0px 0px 1200px 0px',
            },
        );

        observer.observe(wrapper.current);

        return () => observer.disconnect();
    }, [callback, read, wrapper, article]);

    return (
        <article
            ref={wrapper}
            data-id={article.id}
            className={clsx(
                styles.article,
                styles[layout],
                read && styles.read,
                !isSuccess && styles.loading,
            )}
            style={{ ['--h' as string]: visible ? false : `${height}px` }}
        >
            {visible && isSuccess ? (
                <Content
                    url={url}
                    title={title}
                    date={date}
                    parent={parent}
                    cover={cover || ''}
                    body={body}
                    summary={summary || ''}
                    layout={layout}
                />
            ) : (
                <></>
            )}
        </article>
    );
};
