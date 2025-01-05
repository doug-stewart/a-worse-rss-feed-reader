import { useSelector } from '@xstate/store/react';
import dayjs from 'dayjs';

import styles from './FeedArticle.module.css';

import { feedStore } from '@/stores/feed.store';
import type { FeedArticleObj } from '@/types';

type FeedArticleProps = { article: FeedArticleObj };

export const FeedArticle = ({ article }: FeedArticleProps) => {
    const { parent, title, url, date, id, cover, summary } = article;

    const categories = useSelector(feedStore, (state) => state.context.feeds);
    const parentName = categories.find((category) => category.id === parent)?.title || 'Orphan';

    return (
        <article className={styles.article} id={id}>
            <h3 className={styles.title}>
                <a href={url}>{title}</a>
            </h3>

            {date && (
                <time className={styles.date} dateTime={`${dayjs(date).format('YYYY-MM-DD')}`}>
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

            <a className={styles.more} href={url}>
                read more »
            </a>
        </article>
    );
};
