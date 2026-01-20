import axios from 'axios';
import DOMPurify from 'dompurify';

import type { CategoriesObj, CategoryObj } from '../types';

export const fetchCategories = async (): Promise<CategoriesObj> => {
    const settings = await axios.get('/categories.json');

    const collatedCategories = settings.data.categories.map((category: CategoryObj) => ({
        ...category,
        text: DOMPurify.sanitize(category.text),
    }));

    return {
        categoryOrder: settings.data.categoryOrder || [],
        categories: collatedCategories || [],
    };
};
