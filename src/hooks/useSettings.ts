import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DOMPurify from 'dompurify';

import type { CategoryObj, SettingsObj } from '@/types';

const fetchSettings = async (): Promise<SettingsObj> => {
    const settings = await axios.get('/settings.json');

    const collatedCategories = settings.data.categories.map((category: CategoryObj) => ({
        ...category,
        text: DOMPurify.sanitize(category.text),
    }));

    return {
        categoryOrder: settings.data.categoryOrder || [],
        categories: collatedCategories || [],
    };
};

export const useSettings = (): SettingsObj => {
    const { data } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
    });

    return data || { categories: [], categoryOrder: [] };
};
