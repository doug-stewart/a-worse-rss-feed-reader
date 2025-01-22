import { createStore } from '@xstate/store';

import { ArticleObj } from '@/types';

type articlesStoreObj = { articles: Array<ArticleObj> };

const initial = {
    articles: [],
};

export const articlesStore = createStore({
    context: initial as articlesStoreObj,
    on: {
        initialize: () => initial,
        setAll: (_, event: { articles: Array<ArticleObj> }) => {
            // console.trace('setAll called');
            return { articles: event.articles };
        },
        set: (context, event: { article: ArticleObj }) => {
            console.log('set called');
            const current = [...context.articles];

            const index = current.findIndex((article) => article.id === event.article.id);

            if (index === -1) {
                current.push(event.article);
            } else {
                current[index] = event.article;
            }
            return { articles: current };
        },
        remove: (context, event: { id: string }) => {
            const current = [...context.articles];
            const index = current.findIndex((article) => article.id === event.id);
            if (index === -1) return context;
            delete current[index];
            return { articles: current };
        },
    },
});
