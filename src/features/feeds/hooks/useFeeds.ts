import { useQuery } from '@tanstack/react-query';

import type { FeedObj } from '../types';

import { fetchFeeds } from '@/features/feeds/api/fetchFeeds';

export const useFeeds = (): Array<FeedObj> => {
    const { data } = useQuery({
        queryKey: ['feeds'],
        queryFn: fetchFeeds,
    });

    return data || [];
};
