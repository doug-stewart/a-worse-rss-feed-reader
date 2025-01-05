import DOMPurify from 'dompurify';

import { isImageUrl } from './isImageUrl';

import type { FeedArticleObj } from '@/types';

export const parseFeedItem = (
    rssRawItem: Element,
    fallbackDate: number,
    parent: number,
): FeedArticleObj => {
    const url = rssRawItem.querySelector('link')?.textContent || '';
    const id = rssRawItem.querySelector('id')?.textContent || url;

    const title = DOMPurify.sanitize(
        rssRawItem.querySelector('title')?.textContent || 'Untitled Somehow',
    );

    const date = new Date(
        rssRawItem.querySelector('updated, published, pubDate')?.textContent || fallbackDate,
    ).getTime();

    const media = [
        ...rssRawItem.getElementsByTagName('media:content'),
        ...rssRawItem.getElementsByTagName('enclosure'),
        ...rssRawItem.getElementsByTagName('media:thumbnail'),
    ];

    let cover = media.find((el) => el.hasAttribute('url'))?.getAttribute('url') || '';

    if (cover === '') {
        const srcOptions = rssRawItem.outerHTML.match(/(?<=src=("|')).*?(?=("|'))/g) || [];
        const posterOptions = rssRawItem.outerHTML.match(/(?<=poster=("|')).*?(?=("|'))/g) || [];
        const urlOptions =
            rssRawItem.outerHTML.match(/(?<=("|')url("|'):("|')).*?(?=("|'))/g) || [];

        const options = [...srcOptions, ...posterOptions, ...urlOptions];
        const filtered = options?.filter((option) => isImageUrl(option));

        cover = filtered?.at(0) || '';
    }

    const summary = DOMPurify.sanitize(
        (rssRawItem.getElementsByTagName('summary') ||
            rssRawItem.getElementsByTagName('description'))[0]?.textContent || '',
        { USE_PROFILES: { html: false } },
    );

    return { title, url, id, date, cover, summary, parent, viewed: false };
};
