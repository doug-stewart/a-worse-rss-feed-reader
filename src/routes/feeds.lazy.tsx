import { Batcher } from '@tanstack/pacer';
import { useHotkey } from '@tanstack/react-hotkeys';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import FullIcon from '@/assets/full.svg?react';
import GridIcon from '@/assets/grid.svg?react';
import ListIcon from '@/assets/list.svg?react';
import MarkAllIcon from '@/assets/mark-all.svg?react';
import RefreshIcon from '@/assets/refresh.svg?react';
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

    const { feeds } = useFeeds();
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
        const layouts: Array<LayoutConsts> = ['row', 'card', 'full'];
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
            <header style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <h2>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: categoryName || feedName || 'All Feeds',
                        }}
                    />
                    ({unreadCount})
                </h2>
                <FeedFilters />

                <div>
                    <button onClick={refreshArticles}>
                        <RefreshIcon title="Refresh Articles" />
                    </button>
                    <button onClick={handleMarkAllRead}>
                        <MarkAllIcon title="Mark All Read" />
                    </button>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === 'row'}
                                onChange={() => changeLayout('row')}
                            />
                            <ListIcon title="Row" />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === 'card'}
                                onChange={() => changeLayout('card')}
                            />
                            <GridIcon title="Card" />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === 'full'}
                                onChange={() => changeLayout('full')}
                            />
                            <FullIcon title="Full" />
                        </label>
                    </form>
                </div>
            </header>
            <ArticleList layout={layout} articles={articles} onRead={handleMarkRead} />
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
