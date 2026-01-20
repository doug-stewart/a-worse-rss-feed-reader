import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserStoreState = {
    read: Array<string>;
    actions: {
        initialize: (read: Array<string>) => void;
        markRead: (ids: Array<string>) => void;
        markUnread: (ids: Array<string>) => void;
    };
};

const useUserStore = create<UserStoreState>()(
    persist(
        (set) => ({
            read: [],
            actions: {
                initialize: (read: Array<string>) => set(() => ({ read })),
                markRead: (ids: Array<string>) =>
                    set((state) => ({ read: [...state.read, ...ids] })),
                markUnread: (ids: Array<string>) =>
                    set((state) => ({
                        read: state.read.filter((readId) => !ids.includes(readId)),
                    })),
            },
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ read: state.read }),
        },
    ),
);

export const useRead = () => useUserStore((state) => state.read);

export const useUserActions = () => useUserStore((state) => state.actions);
