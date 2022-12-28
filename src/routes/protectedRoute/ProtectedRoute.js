import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logoutAction } from "../../redux/actions/UserActions";


export const ProtectedRoute = ({ children }) => {
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const reduxUserData = useSelector(state => state.UserReducer);
    
    if (!reduxUserData.token) {
        reduxDispatch(logoutAction());
        history('/');
    };
    return children;
};
