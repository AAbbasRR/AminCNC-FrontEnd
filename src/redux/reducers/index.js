import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import CartProductReducer from './CartProductReducer';

const rootReducer = combineReducers({
    UserReducer,
    CartProductReducer,
});

export default rootReducer;
