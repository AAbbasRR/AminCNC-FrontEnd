import CartProductTypes from '../types/CartProductTypes';

export const addProductToCartAction = (product, material, cart) => {
    return {
        type: CartProductTypes.addProductToCart,
        product,
        material,
        cart
    };
};

export const removeProductFromCartAction = (product_id, material_id) => {
    return {
        type: CartProductTypes.removeProductFromCart,
        product_id,
        material_id
    };
};

export const resetAction = () => {
    return {
        type: CartProductTypes.reset,
    };
};
