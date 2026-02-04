import { Batcher, debounce } from '@tanstack/pacer';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { DropdownMenu } from '@/components/dropdown-menu/DropdownMenu';
import { ArticleList } from '@/features/feeds/components/article-list/ArticleList';
import { useArticles } from '@/features/feeds/hooks/useArticles';
import { useCategories } from '@/features/feeds/hooks/useCategories';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';
import { useShortcut } from '@/features/shortcuts/hooks/useShortcut';
import { useRead, useUserActions } from '@/features/user/stores/user.store';
import type { LayoutConsts } from '@/types';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const { markRead } = useUserActions();

    const { articles: allArticles, articlesQuery } = useArticles({
        filter: { category: searchParams.category, feed: searchParams.feed },
    });

    const feeds = useFeeds();
    const allRead = useRead();
    const { categories } = useCategories();

    const [hidden, setHidden] = useState(new Set(allRead));
    const [layout, setLayout] = useState<LayoutConsts>('card');
    const [activeParams, setActiveParams] = useState({
        feed: searchParams.feed,
        category: searchParams.category,
    });

    if (
        activeParams.feed !== searchParams.feed ||
        activeParams.category !== searchParams.category
    ) {
        setActiveParams({ feed: searchParams.feed, category: searchParams.category });
        setHidden(new Set(allRead));
    }

    const categoryName = categories.find((category) => category.id === searchParams.category)?.text;
    const feedName = feeds.find((feed) => feed.id === searchParams.feed)?.title;

    const changeLayout = (newLayout: LayoutConsts) => setLayout(newLayout);

    const handleRefresh = () => {
        setHidden(new Set(allRead));
        articlesQuery.forEach((query) => query.refetch());
    };

    const pendingRead = new Batcher<string>((ids) => {
        markRead(ids);
    }, {});

    const debouncedUpdateRead = debounce(
        () => {
            console.log('marking read articles');
            pendingRead.flush();
        },
        { wait: 500 },
    );

    const handleMarkRead = (id: string) => {
        pendingRead.addItem(id);
        debouncedUpdateRead();
    };

    const handleMarkAllRead = () => {
        const ids = Array.from(allArticles).map(({ id }) => id);
        markRead(ids);
    };

    // Register dialog shortcut
    useShortcut({
        keyCode: 'l',
        modifier: 'shift',
        description: 'Cycle through layouts',
        fn: () => console.log('Cycle through layouts'),
    });
    useShortcut({
        keyCode: 'r',
        modifier: 'shift',
        description: 'Refresh feeds',
        fn: () => console.log('Refresh feeds'),
    });
    useShortcut({
        keyCode: 'backspace',
        modifier: 'shift',
        description: 'Mark feeds as read',
        fn: () => console.log('Mark feeds as read'),
    });

    const displayArticles = allArticles.filter((article) => !hidden.has(article.id));

    return (
        <>
            <header>
                <h2>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: categoryName || feedName || 'All Feeds',
                        }}
                    />
                    ({displayArticles.length})
                </h2>
                <menu>
                    <li>
                        <button onClick={handleRefresh}>Refresh</button>
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
            <ArticleList layout={layout} articles={displayArticles} onRead={handleMarkRead} />
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
