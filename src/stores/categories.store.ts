import { createStore } from '@xstate/store';

import { CategoryObj } from '@/types';

type categoriesStoreObj = { order: Array<number>; categories: Array<CategoryObj> };

const initial = {
    order: [],
    categories: [],
};

export const categoriesStore = createStore({
    context: initial as categoriesStoreObj,
    on: {
        initialize: () => initial,
        reorder: (_, event: { order: Array<number> }) => {
            return { order: event.order };
        },
        setAll: (_, event: { categories: Array<CategoryObj> }) => {
            return { categories: event.categories };
        },
        set: (context, event: { category: CategoryObj }) => {
            const current = [...context.categories];

            const index = current.findIndex((category) => category.id === event.category.id);

            if (index === -1) {
                current.push(event.category);
            } else {
                current[index] = event.category;
            }
            return { categories: current };
        },
        remove: (context, event: { id: number }) => {
            const current = [...context.categories];
            const index = current.findIndex((category) => category.id === event.id);
            if (index === -1) return context;
            delete current[index];
            return { categories: current };
        },
    },
});
