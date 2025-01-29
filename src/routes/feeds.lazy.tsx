import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { ArticleCard } from '@/components/article-card/ArticleCard';
import { ArticleList } from '@/components/article-list/ArticleList';
import { DropdownMenu } from '@/components/dropdown-menu/DropdownMenu';
import { useArticles } from '@/hooks/useArticles';
import { useFeeds } from '@/hooks/useFeeds';
import { useSettings } from '@/hooks/useSettings';
import { useShortcut } from '@/hooks/useShortcut';
import { userStore } from '@/stores/user.store';
import { ArticleObj, LayoutConsts } from '@/types';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const allArticles = useArticles({
        filter: { category: searchParams.category, feed: searchParams.feed },
    });
    const feeds = useFeeds();
    const { categories } = useSettings();

    const [articles, setArticles] = useState<Array<ArticleObj>>([]);
    const [filterSnapshot, setFilterSnapshot] = useState({});

    const [layout, setLayout] = useState<LayoutConsts>('card');
    const [read, setRead] = useState(new Set<string>());
    const [hidden, setHidden] = useState(new Set<string>());

    const categoryName = categories.find((category) => category.id === searchParams.category)?.text;
    const feedName = feeds.find((feed) => feed.id === searchParams.feed)?.title;

    const changeLayout = (layout: LayoutConsts) => setLayout(layout);

    const handleMarkRead = (id: string) => {
        setHidden((hidden) => new Set(hidden.add(id)));
        setRead((read) => new Set(read.add(id)));
    };

    const handleMarkAllRead = () => allArticles.forEach((article) => handleMarkRead(article.id));

    useEffect(() => {
        // Putting this ina  useEffect allows the state to update asynchronously
        // and doesn't block the main thread
        userStore.send({ type: 'add', ids: Array.from(read) });
    }, [read]);

    useEffect(() => {
        // This will be replaced with some kind of database interaction
        if (JSON.stringify(filterSnapshot) === JSON.stringify(searchParams)) return;
        setFilterSnapshot({ ...searchParams });
        setRead(new Set());
        setArticles(allArticles.filter((article) => !hidden.has(article.id)));
    }, [allArticles, filterSnapshot, searchParams, hidden]);

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

    return (
        <>
            <header>
                <h2>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: categoryName || feedName || 'All Feeds',
                        }}
                    />
                    ({articles.length})
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
                {articles.map((article) => (
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
