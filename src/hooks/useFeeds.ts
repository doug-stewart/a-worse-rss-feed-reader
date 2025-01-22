import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DOMPurify from 'dompurify';

import { articleRegEx } from '@/helpers/articleRegEx';
import type { FeedObj } from '@/types';

const fetchFeeds = async (): Promise<Array<FeedObj>> => {
    const rawFeeds = await axios.get('/feeds.json');

    const sanitizedTitles = rawFeeds.data.feeds.map((feed: FeedObj) => ({
        ...feed,
        title: DOMPurify.sanitize(feed.title),
    }));

    const sortedFeeds = sanitizedTitles.sort((feedA: FeedObj, feedB: FeedObj) => {
        const titleA = feedA.title.replace(articleRegEx, '');
        const titleB = feedB.title.replace(articleRegEx, '');
        return titleA.localeCompare(titleB, 'en', { sensitivity: 'base' });
    });

    return sortedFeeds;
};

export const useFeeds = (): Array<FeedObj> => {
    const { data } = useQuery({
        queryKey: ['feeds'],
        queryFn: fetchFeeds,
    });

    return data || [];
};
