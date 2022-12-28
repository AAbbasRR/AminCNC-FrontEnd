export const DeliveryModesListAPI = () => ({
    method: 'get',
    url: 'product/api/delivery/list/',
});

export const SubmitOrderAPI = (products, description, user_and_address_id, delivery_mode_id) => ({
    method: 'post',
    url: `order/api/submit/`,
    token: true,
    data: {
        products: products,
        description: description,
        user_and_address_id: user_and_address_id,
        delivery_mode_id: delivery_mode_id,
    },
});

export const EditOrderAPI = (tracking_code, description) => ({
    method: 'put',
    url: `order/api/edit/${tracking_code}/`,
    token: true,
    data: {
        description: description,
    },
});

export const OrderHistoryAPI = () => ({
    method: 'get',
    url: `order/api/history/`,
    token: true,
});