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

export const GetCategorisListAPI = () => ({
    method: 'get',
    url: `product/api/categories/all/`,
});

export const GetCategoryProductsAPI = (slug, page = 1) => ({
    method: 'get',
    url: `product/api/categories/${slug}/products/`,
    params: {
        page: page
    }
});