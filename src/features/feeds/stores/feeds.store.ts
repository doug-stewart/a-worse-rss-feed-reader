import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { FeedObj } from '../types';

export type FeedsStoreState = {
    feeds: Array<FeedObj>;
    actions: {
        initialize: (feeds: Array<FeedObj>) => void;
        add: (feed: FeedObj) => void;
        update: (feed: FeedObj) => void;
        remove: (id: number) => void;
    };
};

const useFeedsStore = create<FeedsStoreState>()(
    persist(
        (set) => ({
            feeds: [],
            actions: {
                initialize: (feeds: Array<FeedObj>) => set(() => ({ feeds })),
                add: (feed: FeedObj) => set((state) => ({ feeds: [...state.feeds, feed] })),
                update: (feed: FeedObj) =>
                    set((state) => ({
                        feeds: state.feeds.map((f) => (f.id === feed.id ? feed : f)),
                    })),
                remove: (id: number) =>
                    set((state) => ({
                        feeds: state.feeds.filter((f) => f.id !== id),
                    })),
            },
        }),
        {
            name: 'feeds-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ feeds: state.feeds }),
        },
    ),
);

export const useFeeds = () => useFeedsStore((state) => state.feeds);

export const useFeedsActions = () => useFeedsStore((state) => state.actions);
