import DOMPurify from 'dompurify';

import type { ArticleObj } from '@/types';

export const parseArticle = (
    rssRawItem: Element,
    fallbackDate: number,
    parent: number,
): ArticleObj => {
    const titleNode = rssRawItem.querySelector('title');
    const urlNode = rssRawItem.querySelector('link');
    const dateNode = rssRawItem.querySelector('updated, published, pubDate');

    const mediaNodes = [
        ...rssRawItem.getElementsByTagName('media:content'),
        ...rssRawItem.getElementsByTagName('enclosure'),
        ...rssRawItem.getElementsByTagName('media:thumbnail'),
    ];

    const summaryNode =
        rssRawItem.getElementsByTagName('summary')[0] ||
        rssRawItem.getElementsByTagName('description')[0];

    const bodyNode =
        rssRawItem.getElementsByTagName('content:encoded')[0] ||
        rssRawItem.getElementsByTagName('content')[0] ||
        rssRawItem.getElementsByTagName('description')[0];

    const url = urlNode?.textContent || urlNode?.getAttribute('href') || '';
    const id = rssRawItem.querySelector('id')?.textContent || url;

    const title = DOMPurify.sanitize(titleNode?.textContent || 'Untitled Somehow');

    const date = new Date(dateNode?.textContent || fallbackDate).getTime();

    const cover = mediaNodes.find((el) => el.hasAttribute('url'))?.getAttribute('url') || '';

    const summary = DOMPurify.sanitize(summaryNode?.textContent || '', {
        USE_PROFILES: { html: false },
    });

    const body = DOMPurify.sanitize(bodyNode?.textContent || '');

    return {
        body: body,
        cover: cover,
        date: date,
        id: encodeURIComponent(id),
        parent: parent,
        summary: summary,
        title: title,
        url: url,
        viewed: false,
        raw: rssRawItem.outerHTML,
    };
};
