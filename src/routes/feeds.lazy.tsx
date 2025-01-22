import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import styles from './feeds.module.css';

import { ArticleList } from '@/components/article-list/ArticleList';
import { DropdownMenu } from '@/components/dropdown-menu/DropdownMenu';
import { useArticles } from '@/hooks/useArticles';
import { useFeeds } from '@/hooks/useFeeds';
import { useSettings } from '@/hooks/useSettings';
import { shortcutStore } from '@/stores/shortcuts.store';
import { LayoutConsts } from '@/types';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const [layout, setLayout] = useState<LayoutConsts>('card');

    const articles = useArticles();
    const feeds = useFeeds();
    const { categories } = useSettings();

    const categoryName = categories.find((category) => category.id === searchParams.category)?.text;
    const feedName = feeds.find((feed) => feed.id === searchParams.feed)?.title;

    const filteredArticles = articles.filter((article) => {
        let include = true;

        if (typeof searchParams.category === 'number') {
            const feed = feeds.find((feed) => feed.id === article.parent);
            include = feed?.category === searchParams.category;
        }

        if (typeof searchParams.feed === 'number') {
            include = article.parent === searchParams.feed;
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
            keyCode: 'backspace',
            modifier: 'shift',
            description: 'Mark feeds as read',
            fn: () => console.log('Mark feeds as read'),
        });
        return () => {
            shortcutStore.send({ type: 'remove', keyCode: 'backspace' });
            shortcutStore.send({ type: 'remove', keyCode: 'l' });
            shortcutStore.send({ type: 'remove', keyCode: 'r' });
        };
    }, []);

    return (
        <>
            <header>
                <h2>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: categoryName || feedName || 'All Feeds',
                        }}
                    />
                    ({filteredArticles.length})
                </h2>
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
            <ArticleList articles={filteredArticles} layout={layout} />

            <footer className={styles.footer}>
                <p>You&rsquo;ve reached the end&hellip;</p>
                <button>Mark All Unseen</button>
            </footer>
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
