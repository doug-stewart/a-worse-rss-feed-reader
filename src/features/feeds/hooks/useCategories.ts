import { useQuery } from '@tanstack/react-query';

import { fetchCategories } from '@/features/feeds/api/fetchCategories';
import type { CategoriesObj } from '@/features/feeds/types';

export const useCategories = (): CategoriesObj => {
    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    return data || { categories: [], categoryOrder: [] };
};
