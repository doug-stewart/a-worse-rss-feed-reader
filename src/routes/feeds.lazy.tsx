import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { DropdownMenu } from '@/components/dropdown-menu/DropdownMenu';
import { ArticleCard } from '@/features/feeds/components/article-card/ArticleCard';
import { ArticleList } from '@/features/feeds/components/article-list/ArticleList';
import { useArticles } from '@/features/feeds/hooks/useArticles';
import { useCategories } from '@/features/feeds/hooks/useCategories';
import { useFeeds } from '@/features/feeds/hooks/useFeeds';
import { useShortcut } from '@/features/shortcuts/hooks/useShortcut';
import { useUserActions } from '@/features/user/stores/user.store';
import type { LayoutConsts } from '@/types';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const { markRead } = useUserActions();

    const allArticles = useArticles({
        filter: { category: searchParams.category, feed: searchParams.feed },
    });
    const feeds = useFeeds();
    const { categories } = useCategories();

    const [layout, setLayout] = useState<LayoutConsts>('card');
    const [read, setRead] = useState(new Set<string>());
    const [hidden, setHidden] = useState(new Set<string>());

    const categoryName = categories.find((category) => category.id === searchParams.category)?.text;
    const feedName = feeds.find((feed) => feed.id === searchParams.feed)?.title;

    const changeLayout = (newLayout: LayoutConsts) => setLayout(newLayout);

    const handleMarkRead = (id: string) => {
        setHidden((currentHidden) => new Set(currentHidden.add(id)));
        setRead((currentRead) => new Set(currentRead.add(id)));
    };

    const handleMarkAllRead = () => allArticles.forEach((article) => handleMarkRead(article.id));

    useEffect(() => {
        // Putting this in a useEffect allows the state to update asynchronously
        // and doesn't block the main thread
        markRead(Array.from(read));
    }, [read, markRead]);

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
                        <button>Refresh</button>
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
            <ArticleList layout={layout}>
                {displayArticles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        callback={handleMarkRead}
                        layout={layout}
                        read={read.has(article.id)}
                    />
                ))}
            </ArticleList>
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
