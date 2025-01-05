import { createFileRoute } from '@tanstack/react-router';

type FeedSearchParams = {
    category?: number;
    feed?: number;
    range?: string;
};

export const Route = createFileRoute('/feeds')({
    validateSearch: (search: Record<string, any>): FeedSearchParams => {
        return {
            category: search.category,
            feed: search.feed,
            range: search.range,
        };
    },
});
