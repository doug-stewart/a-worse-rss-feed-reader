import { createStore } from '@xstate/store';

import { FeedObj } from '@/types';

type feedsStoreObj = { feeds: Array<FeedObj> };

const initial = {
    feeds: [],
};

export const feedsStore = createStore({
    context: initial as feedsStoreObj,
    on: {
        initialize: () => initial,
        setAll: (_, event: { feeds: Array<FeedObj> }) => {
            return { feeds: event.feeds };
        },
        set: (context, event: { feed: FeedObj }) => {
            const current = [...context.feeds];

            const index = current.findIndex((feed) => feed.id === event.feed.id);

            if (index === -1) {
                current.push(event.feed);
            } else {
                current[index] = event.feed;
            }
            return { feeds: current };
        },
        remove: (context, event: { id: number }) => {
            const current = [...context.feeds];
            const index = current.findIndex((feed) => feed.id === event.id);
            if (index === -1) return context;
            delete current[index];
            return { feeds: current };
        },
    },
});
