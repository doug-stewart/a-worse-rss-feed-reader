import { createLazyFileRoute } from '@tanstack/react-router';

import { FeedArticleList } from '@/components/feed-article-list/FeedArticleList';

const RouteComponent = () => {
    return <FeedArticleList />;
};

export const Route = createLazyFileRoute('/')({
    component: RouteComponent,
});
