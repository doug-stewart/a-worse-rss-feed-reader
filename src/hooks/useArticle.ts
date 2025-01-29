import { useQuery } from '@tanstack/react-query';

import { fetchMissingInfo } from '@/helpers/fetchMissingInfo';
import type { ArticleObj } from '@/types';

export const useArticle = (initial: ArticleObj, enhance = false) => {
    const shouldFetch =
        enhance && [initial.cover, initial.summary, initial.body].some((item) => item === '');

    const query = useQuery({
        queryKey: ['article', initial.id],
        queryFn: () => fetchMissingInfo(initial),
        enabled: shouldFetch,
        placeholderData: initial,
    });

    return query;
};
