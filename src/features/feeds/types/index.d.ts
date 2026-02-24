export type CategoryObj = { id: number; text: string };

export type CategoriesObj = {
    categoryOrder: Array<number>;
    categories: Array<CategoryObj>;
};

export type FeedObj = {
    id: number;
    category: number;
    title: string;
    rss: string;
    website: string;
    type: 'rss' | 'atom';
};

export type ArticleObj = {
    parent: number;
    title: string;
    url: string;
    id: string;
    date: number;
    cover: string | null;
    summary: string | null;
    viewed: boolean;
    body: string;
    raw: string;
};

type ParsedFeed = {
    title: string;
    rss: string;
    website: string;
    category: string;
};
