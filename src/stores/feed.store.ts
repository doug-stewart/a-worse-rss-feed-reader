import { createStore } from '@xstate/store';

import { FeedStoreObj } from '@/types';

const initial = { categoryOrder: [], categories: [], feeds: [], articles: [] } as FeedStoreObj;

export const feedStore = createStore({
    context: initial,
    on: {
        initialize: (_, event: { data: FeedStoreObj }) => event.data,
        reset: () => initial,
    },
});
