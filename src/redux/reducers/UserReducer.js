import UserTypes from '../types/UserTypes';

const initialState = {
    id: null,
    mobile_number: null,
    token: null,
    first_name: null,
    last_name: null,
    registerSendOtpCodeStatus: false,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case UserTypes.sendActiveAccountCode:
            return {
                ...state,
                mobile_number: action.mobile_number,
                registerSendOtpCodeStatus: true
            };

        case UserTypes.activeAccount:
            return {
                ...state,
                mobile_number: null,
                registerSendOtpCodeStatus: false
            };

        case UserTypes.login:
            return {
                ...state,
                id: action.result.id,
                mobile_number: action.result.mobile_number,
                token: action.result.auth_token,
                first_name: action.result.first_name,
                last_name: action.result.last_name,
            };

        case UserTypes.logout:
            return initialState;

        case UserTypes.completeUserProfile:
            return {
                ...state,
                first_name: action.first_name,
                last_name: action.last_name
            };

        default:
            return state;
    };
};

export default UserReducer;

