import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelector } from '@xstate/store/react';

import { FeedArticleList } from '@/components/feed-article-list/FeedArticleList';
import { feedStore } from '@/stores/feed.store';

const RouteComponent = () => {
    const searchParams = Route.useSearch();

    const categories = useSelector(feedStore, (state) => state.context.categories);
    const categoryName = categories.find((category) => category.id === searchParams.category)?.name;

    const feeds = useSelector(feedStore, (state) => state.context.feeds);
    const feedName = feeds.find((feed) => feed.id === searchParams.feed)?.title;

    return (
        <>
            <h2 dangerouslySetInnerHTML={{ __html: categoryName || feedName || 'All Feeds' }}></h2>
            <FeedArticleList filters={searchParams} />
        </>
    );
};

export const Route = createLazyFileRoute('/feeds')({
    component: RouteComponent,
});
