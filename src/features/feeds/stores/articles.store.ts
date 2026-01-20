import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ArticleObj } from '../types';

export type ArticlesStoreState = {
    articles: Array<ArticleObj>;
    actions: {
        initialize: (articles: Array<ArticleObj>) => void;
        add: (article: ArticleObj) => void;
        update: (article: ArticleObj) => void;
        remove: (id: string) => void;
    };
};

const useArticlesStore = create<ArticlesStoreState>()(
    persist(
        (set) => ({
            articles: [],
            actions: {
                initialize: (articles: Array<ArticleObj>) => set(() => ({ articles })),
                add: (article: ArticleObj) =>
                    set((state) => ({ articles: [...state.articles, article] })),
                update: (article: ArticleObj) =>
                    set((state) => ({
                        articles: state.articles.map((a) => (a.id === article.id ? article : a)),
                    })),
                remove: (id: string) =>
                    set((state) => ({
                        articles: state.articles.filter((a) => a.id !== id),
                    })),
            },
        }),
        {
            name: 'articles-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ articles: state.articles }),
        },
    ),
);

export const useArticles = () => useArticlesStore((state) => state.articles);

export const useArticlesActions = () => useArticlesStore((state) => state.actions);
