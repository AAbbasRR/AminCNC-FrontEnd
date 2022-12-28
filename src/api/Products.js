export const IndexProductsAPI = () => ({
    method: 'get',
    url: 'product/api/products/index/',
});

export const AllProductsAPI = (page = 1) => ({
    method: 'get',
    url: 'product/api/products/all/',
    params: {
        page: page
    }
});

export const GetSingleProductAPI = (slug) => ({
    method: 'get',
    url: `product/api/products/single/${slug}/`,
});