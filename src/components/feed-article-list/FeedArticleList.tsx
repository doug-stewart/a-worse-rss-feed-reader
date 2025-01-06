import { useSelector } from '@xstate/store/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { DropdownMenu } from '../dropdown-menu/DropdownMenu';

import styles from './FeedArticleList.module.css';

import { FeedArticle } from '@/components/feed-article/FeedArticle';
import { feedStore } from '@/stores/feed.store';
import { shortcutStore } from '@/stores/shortcut.store';
import type { LayoutConsts } from '@/types';

type FeedArticleListProps = {
    filters: {
        category?: number;
        feed?: number;
        range?: string;
    };
};

export const FeedArticleList = ({ filters }: FeedArticleListProps) => {
    const articles = useSelector(feedStore, (state) => state.context.articles);
    const feeds = useSelector(feedStore, (state) => state.context.feeds);

    const [layout, setLayout] = useState<LayoutConsts>('card');

    const filteredArticles = articles.filter((article) => {
        let include = true;

        if (filters.category) {
            const feed = feeds.find((feed) => feed.id === article.parent);
            include = feed?.category === filters.category;
        }

        if (filters.feed) {
            include = article.parent === filters.feed;
        }

        return include;
    });

    const changeLayout = (layout: LayoutConsts) => {
        setLayout(layout);
        console.log('Change layout to', layout);
    };

    // Register dialog shortcut
    useEffect(() => {
        shortcutStore.send({
            type: 'add',
            keyCode: 'l',
            modifier: 'shift',
            description: 'Cycle through layouts',
            fn: () => console.log('Cycle through layouts'),
        });
        shortcutStore.send({
            type: 'add',
            keyCode: 'r',
            modifier: 'shift',
            description: 'Refresh feeds',
            fn: () => console.log('Refresh feeds'),
        });
        shortcutStore.send({
            type: 'add',
            keyCode: 'delete',
            modifier: 'shift',
            description: 'Mark feeds as read',
            fn: () => console.log('Mark feeds as read'),
        });
        return () => {
            shortcutStore.send({ type: 'remove', keyCode: 'delete' });
            shortcutStore.send({ type: 'remove', keyCode: 'l' });
            shortcutStore.send({ type: 'remove', keyCode: 'r' });
        };
    }, []);

    return (
        <>
            <header>
                <h2>Feeds ({filteredArticles.length})</h2>
                <menu>
                    <li>
                        <button>Refresh</button>
                    </li>
                    <li>
                        <button>Mark all read</button>
                    </li>
                    <li>
                        <DropdownMenu button="Change View">
                            <button onClick={() => changeLayout('line')}>Dense Line</button>
                            <button onClick={() => changeLayout('row')}>Row</button>
                            <button onClick={() => changeLayout('card')}>Cards</button>
                            <button onClick={() => changeLayout('full')}>Full</button>
                        </DropdownMenu>
                    </li>
                </menu>
            </header>
            <div className={clsx(styles.list, styles[layout])}>
                {filteredArticles.map((article) => (
                    <FeedArticle key={article.id} article={article} layout={layout} />
                ))}
            </div>

            <p>You&rsquo;ve reached the end&hellip;</p>
            <button>Mark All Unseen</button>
        </>
    );
};
