import { useQuery } from '@tanstack/react-query';

import { fetchMissingInfo } from '@/helpers/fetchMissingInfo';
import type { ArticleObj } from '@/types';

export const useArticle = (article: ArticleObj, enhance = false): ArticleObj => {
    const { data } = useQuery({
        queryKey: ['article', article.id],
        queryFn: () => fetchMissingInfo(article),
        enabled:
            enhance && [article.cover, article.summary, article.body].some((item) => item === ''),
    });

    return Object.assign(article, data);
};
