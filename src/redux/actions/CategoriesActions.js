import CategoriesTypes from '../types/CategoriesTypes';

export const setAction = (payload) => {
    return {
        type: CategoriesTypes.set,
        payload,
    };
};

export const resetAction = () => {
    return {
        type: CategoriesTypes.reset,
    };
};
