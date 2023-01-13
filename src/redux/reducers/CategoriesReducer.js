import CategoriesTypes from '../types/CategoriesTypes';

const initialState = [];

const CategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case CategoriesTypes.set:
            return action.payload;

        case CategoriesTypes.reset:
            return initialState;

        default:
            return state;
    };
};

export default CategoriesReducer;

