import { useSelector } from '@xstate/store/react';

import { userStore } from '@/stores/user.store';

export const useRead = (id: string) => {
    const readArticles = useSelector(userStore, (state) => state.context.read);
    const read = readArticles.includes(id);
    return read;
};
