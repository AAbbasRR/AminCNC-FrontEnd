import CartProductTypes from '../types/CartProductTypes';

const initialState = [];

const CartProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case CartProductTypes.addProductToCart:
            let productData = {
                product_id: action.product.productId,
                name: action.product.name,
                slug: action.product.slug,
                image: action.product.images[0].image,
                material_id: action.material.value,
                material_name: action.material.label,
                ones_price: action.material.price,
                number: action.cart.number,
                price: action.cart.price,
                discountPrice: action.cart.discountPrice,
                discountSelected: action.cart.discountSelected,
                preparation_time: action.cart.preparationTime
            };
            let previousProduct = state.find(item => item.product_id === productData.product_id && item.material_id === productData.material_id);
            if (previousProduct) {
                let productIndex = state.findIndex(item => item.product_id === productData.product_id && item.material_id === productData.material_id);
                state[productIndex] = productData;
                return state;
            } else {
                return [
                    ...state,
                    productData
                ];
            };

        case CartProductTypes.removeProductFromCart:
            return state.filter(item => {
                if (item.product_id === action.product_id) {
                    if (item.material_id !== action.material_id) {
                        return item;
                    };
                } else {
                    return item;
                };
            });

        case CartProductTypes.reset:
            return initialState;

        default:
            return state;
    };
};

export default CartProductReducer;

