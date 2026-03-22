import { useQuery } from '@tanstack/react-query';

import type { FeedObj } from '../types';

import { fetchFeeds } from '@/features/feeds/api/fetchFeeds';

export const useFeeds = (): { feeds: Array<FeedObj>; query: ReturnType<typeof useQuery> } => {
    const query = useQuery({
        queryKey: ['feeds'],
        queryFn: fetchFeeds,
    });

    return { feeds: query.data || [], query };
};
