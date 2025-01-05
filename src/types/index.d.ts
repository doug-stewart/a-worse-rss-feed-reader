export type CategoryObj = { id: number; name: string };

export type FeedObj = {
    id: number;
    category: number;
    title: string;
    rss: string;
    website: string;
    type: 'rss' | 'atom';
};

export type FeedsDataObj = {
    categoryOrder: Array<number>;
    categories: Array<CategoryObj>;
    feeds: Array<FeedObj>;
};

export type FeedStoreObj = {
    categoryOrder: Array<number>;
    categories: Array<CategoryObj>;
    feeds: Array<FeedObj>;
    articles: Array<FeedArticleObj>;
};

export type FeedArticleObj = {
    parent: number;
    title: string;
    url: string;
    id: string;
    date: number;
    cover: string | null;
    summary: string | null;
    viewed: boolean;
};
