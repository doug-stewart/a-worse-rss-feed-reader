import { parseOpml } from 'feedsmith';

type ParsedFeed = {
    title: string;
    rss: string;
    website: string;
    category: string;
};

export const parseOPML = (xml: string) => {
    const collated: { [key: string]: Array<ParsedFeed> } = { Uncategorized: [] };
    const feeds: Array<ParsedFeed> = [];
    const opml = parseOpml(xml);

    const traverse = (outlines: Array<any>, categoryPath: Array<string> = []) => {
        for (const outline of outlines) {
            if (outline.type === 'rss' && outline.xmlUrl) {
                feeds.push({
                    title: outline.title || outline.text || '',
                    rss: outline.xmlUrl,
                    website: outline.htmlUrl || new URL(outline.xmlUrl).origin,
                    category: categoryPath.join(' > '),
                });
            }

            if (outline.outlines) {
                traverse(outline.outlines, [...categoryPath, outline.title || outline.text || '']);
            }
        }
    };

    traverse(opml.body?.outlines || []);

    for (const feed of feeds) {
        if (feed.category) {
            if (Object.hasOwn(collated, feed.category) === false) {
                collated[feed.category] = [];
            }
            collated[feed.category].push(feed);
        } else {
            collated.Uncategorized.push(feed);
        }
    }

    if (collated.Uncategorized.length === 0) {
        delete collated.Uncategorized;
    }

    return collated;
};
