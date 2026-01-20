import axios from 'axios';
import DOMPurify from 'dompurify';

import type { FeedObj } from '../types';

import { articleRegEx } from '@/features/feeds/helpers/articleRegEx';

export const fetchFeeds = async (): Promise<Array<FeedObj>> => {
    const rawFeeds = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/feeds.json`);

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
