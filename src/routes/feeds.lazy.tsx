import { Batcher } from '@tanstack/pacer';
import { useHotkey } from '@tanstack/react-hotkeys';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { DropdownMenu } from '@/components/dropdown-menu/DropdownMenu';
import { ArticleList } from '@/features/feeds/components/article-list/ArticleList';
import { FeedFilters } from '@/features/feeds/components/feed-filters/FeedFilters';
import { useArticles } from '@/features/feeds/hooks/useArticles';
import { useCategories } from '@/features/feeds/hooks/useCategories';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';
import { useUserActions } from '@/features/user/stores/user.store';
import type { LayoutConsts } from '@/types';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const { markRead } = useUserActions();

    const { articles, unreadCount, refreshArticles } = useArticles({
        category: searchParams.category,
        feed: searchParams.feed,
    });

    const feeds = useFeeds();
    const { categories } = useCategories();

    const [layout, setLayout] = useState<LayoutConsts>('card');

    const categoryName = categories
        .filter((category) => searchParams.category?.includes(category.id))
        .map((category) => category.text)
        .join(', ');

    const feedName = feeds
        .filter((feed) => searchParams.feed?.includes(feed.id))
        .map((feed) => feed.title)
        .join(', ');

    const changeLayout = (newLayout: LayoutConsts) => setLayout(newLayout);

    const cycleLayout = () => {
        const layouts: Array<LayoutConsts> = ['line', 'row', 'card', 'full'];
        const currentIndex = layouts.indexOf(layout);
        const nextIndex = (currentIndex + 1) % layouts.length;
        setLayout(layouts[nextIndex]);
    };

    const pendingRead = new Batcher<string>(
        (ids) => {
            markRead(ids);
        },
        { wait: 100 },
    );

    const handleMarkRead = (id: string) => {
        pendingRead.addItem(id);
    };

    const handleMarkAllRead = () => {
        const ids = Array.from(articles).map(({ id }) => id);
        markRead(ids);
        refreshArticles();
    };

    useHotkey('Shift+L', () => cycleLayout());
    useHotkey('Shift+R', () => refreshArticles());
    useHotkey('Shift+Backspace', () => handleMarkAllRead());

    return (
        <>
            <FeedFilters />
            <header>
                <h2>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: categoryName || feedName || 'All Feeds',
                        }}
                    />
                    ({unreadCount})
                </h2>
                <menu>
                    <li>
                        <button onClick={refreshArticles}>Refresh</button>
                    </li>
                    <li>
                        <button onClick={handleMarkAllRead}>Mark all read</button>
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
            <ArticleList layout={layout} articles={articles} onRead={handleMarkRead} />
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
