import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protectedRoute/ProtectedRoute';

import Page404 from '../../containers/page404/Page404';
import ZarinpalPayment from '../../containers/zarinpalPayment/ZarinpalPayment';
import Home from '../../containers/home/Home';
import Products from '../../containers/products/Products';
import FrequentlyQuestions from '../../containers/frequentlyQuestions/FrequentlyQuestions';
import SingleProduct from '../../containers/singleProduct/SingleProduct';

import Register from '../../authentication/register/Register';
import ActiveAccount from '../../authentication/activeAccount/ActiveAccount';
import Login from '../../authentication/login/Login';

import Dashboard from '../../accounting/dashboard/Dashboard';
import Addresses from '../../accounting/addresses/Addresses';
import Cart from '../../accounting/cart/Cart';
import History from '../../accounting/history/History';

const AppRouter = () => {
    const routes = [
        {
            path: '*',
            component: <Page404 />,
            protected: false,
            exact: false,
        },
        {
            path: '/paymentStatus/zarinpal',
            component: <ZarinpalPayment />,
            protected: false,
            exact: true,
        },
        {
            path: '/',
            component: <Home />,
            protected: false,
            exact: true
        },
        {
            path: '/products',
            component: <Products />,
            protected: false,
            exact: true
        },
        {
            path: '/products/:page',
            component: <Products />,
            protected: false,
            exact: true
        },
        {
            path: '/singleProduct/:slug',
            component: <SingleProduct />,
            protected: false,
            exact: true
        },
        {
            path: '/frequentlyQuestions',
            component: <FrequentlyQuestions />,
            protected: false,
            exact: true
        },
        {
            path: '/frequentlyQuestions/:page',
            component: <FrequentlyQuestions />,
            protected: false,
            exact: true
        },
        {
            path: '/auth/register',
            component: <Register />,
            protected: false,
            exact: true
        },
        {
            path: '/auth/activeAccount',
            component: <ActiveAccount />,
            protected: false,
            exact: true
        },
        {
            path: '/auth/login',
            component: <Login />,
            protected: false,
            exact: true
        },
        {
            path: '/dashboard',
            component: <Dashboard />,
            protected: true,
            exact: true
        },
        {
            path: '/dashboard/addresses',
            component: <Addresses />,
            protected: true,
            exact: true
        },
        {
            path: '/dashboard/cart',
            component: <Cart />,
            protected: true,
            exact: true
        },
        {
            path: '/dashboard/orderHistory',
            component: <History />,
            protected: true,
            exact: true
        },
    ]
    return (
        <Routes>
            {routes.map((element, index) => (
                <>
                    <Route key={`approutes_${index}`} exact={element.exact} path={element.path} element={element.protected ?
                        <ProtectedRoute>
                            {element.component}
                        </ProtectedRoute>
                        :
                        element.component
                    } />
                </>
            ))}
        </Routes>
    );
};

export default AppRouter