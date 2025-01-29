import { createStore } from '@xstate/store';

type userStoreObj = { read: Array<string> };

const initial = {
    read: [],
} as userStoreObj;

export const userStore = createStore({
    context: initial,
    on: {
        initialize: () => initial,
        add: (context, event: { ids: Array<string> }) => ({
            read: [...context.read, ...event.ids],
        }),
    },
});
