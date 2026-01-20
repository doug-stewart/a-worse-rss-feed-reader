import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CategoryObj } from '../types';

export type CategoryStoreState = {
    categories: Array<CategoryObj>;
    order: Array<number>;
    actions: {
        initialize: (categories: Array<CategoryObj>) => void;
        reorder: (order: Array<number>) => void;
        add: (category: CategoryObj) => void;
        update: (category: CategoryObj) => void;
        remove: (id: number) => void;
    };
};

const useCategoriesStore = create<CategoryStoreState>()(
    persist(
        (set) => ({
            categories: [],
            order: [],
            actions: {
                initialize: (categories: Array<CategoryObj>) => set(() => ({ categories })),
                reorder: (order: Array<number>) => set(() => ({ order })),
                add: (category: CategoryObj) =>
                    set((state) => ({ categories: [...state.categories, category] })),
                update: (category: CategoryObj) =>
                    set((state) => ({
                        categories: state.categories.map((c) =>
                            c.id === category.id ? category : c,
                        ),
                    })),
                remove: (id: number) =>
                    set((state) => ({
                        categories: state.categories.filter((c) => c.id !== id),
                    })),
            },
        }),
        {
            name: 'categories-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ categories: state.categories, order: state.order }),
        },
    ),
);

export const useCategories = () => useCategoriesStore((state) => state.categories);

export const useCategoryOrder = () => useCategoriesStore((state) => state.order);

export const useCategoryActions = () => useCategoriesStore((state) => state.actions);
