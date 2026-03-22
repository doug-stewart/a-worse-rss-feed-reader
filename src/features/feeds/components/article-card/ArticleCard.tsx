import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';

import type { ArticleObj } from '../../types';

import styles from './ArticleCard.module.css';
import { Content } from './Content';

import { useArticle } from '@/features/feeds/hooks/useArticle';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';
import { useRead } from '@/features/user/stores/user.store';
import type { LayoutConsts } from '@/types';

type ArticleCardProps = {
    article: ArticleObj;
    layout: LayoutConsts;
    onRead: (id: string) => void;
};

export const ArticleCard = ({ article, layout, onRead }: ArticleCardProps) => {
    const wrapper = useRef<HTMLElement | null>(null);
    const allRead = useRead();

    const read = allRead.includes(article.id);

    const [height, setHeight] = useState(0);
    const [isVisible, setVisible] = useState(false);

    const { feeds } = useFeeds();
    const { data, isSuccess } = useArticle(article, isVisible);

    const { url = '', title = '', date = 0, cover = '', body = '', summary = '' } = data || {};
    const parent = feeds.find((feed) => feed.id === article.parent)?.title || 'Orphan';

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
                if (!read && !onScreen && entry.boundingClientRect.top <= 0) {
                    onRead(article.id);
                }
            },
            {
                threshold: 0,
                // Use excessive bottom scroll margin to give us time
                // to conditionally load additional assets.
                rootMargin: '0px 0px 3000px 0px',
            },
        );

        observer.observe(wrapper.current);

        return () => observer.disconnect();
    }, [onRead, read, wrapper, article]);

    return (
        <article
            ref={wrapper}
            data-id={article.id}
            className={clsx(
                styles.article,
                styles[layout],
                read && styles.read,
                !isVisible && styles.loading,
            )}
            style={{ ['--h' as string]: isVisible ? false : `${height}px` }}
        >
            {isVisible ? (
                <Content
                    url={url}
                    title={title}
                    date={date}
                    parent={parent}
                    cover={isSuccess ? cover || '' : ''}
                    body={body}
                    summary={summary || ''}
                    layout={layout}
                    onRead={() => onRead(article.id)}
                />
            ) : (
                <></>
                // <Skeleton layout={layout} />
            )}
        </article>
    );
};
