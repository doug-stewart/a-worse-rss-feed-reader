export type CategoryObj = { id: number; text: string };

export type LayoutConsts = 'line' | 'row' | 'card' | 'full';

export type FeedObj = {
    id: number;
    category: number;
    title: string;
    rss: string;
    website: string;
    type: 'rss' | 'atom';
};

export type SettingsObj = {
    categoryOrder: Array<number>;
    categories: Array<CategoryObj>;
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

type ShortcutObj = {
    keyCode: string;
    modifier?: string;
    description: string;
    fn: (params?: any) => void;
};

export type ShortcutStoreObj = {
    shortcuts: Array<ShortcutObj>;
};
