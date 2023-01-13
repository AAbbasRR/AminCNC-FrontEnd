import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import CartProductReducer from './CartProductReducer';
import CategoriesReducer from './CategoriesReducer';

const rootReducer = combineReducers({
    UserReducer,
    CartProductReducer,
    CategoriesReducer,
});

export default rootReducer;
