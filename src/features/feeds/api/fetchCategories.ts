import axios from 'axios';
import DOMPurify from 'dompurify';

import type { CategoriesObj, CategoryObj } from '../types';

export const fetchCategories = async (): Promise<CategoriesObj> => {
    const categories = await axios.get(`${import.meta.env.BASE_URL}/categories.json`);

    const collatedCategories = categories.data.categories.map((category: CategoryObj) => ({
        ...category,
        text: DOMPurify.sanitize(category.text),
    }));

    return {
        categoryOrder: categories.data.categoryOrder || [],
        categories: collatedCategories || [],
    };
};
