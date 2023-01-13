import React, { useState, useEffect } from 'react';

import classes from './styles/Products.module.scss';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useParams, useSearchParams } from 'react-router-dom';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Title from '../../components/title/Title';
import Product from '../../components/product/Product';
import StepsOrdering from '../../components/stepsOrdering/StepsOrdering';
import ToUp from '../../components/toUp/ToUp';
import Footer from '../../components/footer/Footer';

import { AllProductsAPI, GetCategoryProductsAPI } from "../../api/Products";
import CallApi from "../../functions/CallApi";

const Products = () => {
    let { page } = useParams();
    const [queryParams, setQueryParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [totalPage, setTotalPage] = useState(null);
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page));
        } else {
            setCurrentPage(1);
        }
    }, []);
    useEffect(() => {
        if (currentPage) {
            let categoryLink = queryParams.get('category');
            if (categoryLink){
                getPageCategoryData(categoryLink);
            }else{
                getPageData();
            }
        };
    }, [currentPage, queryParams]);

    const getPageData = async () => {
        setIsLoading(true);
        try {
            let productDataResponse = await CallApi(AllProductsAPI(currentPage));
            setProductData(productDataResponse.results);
            setTotalPage(productDataResponse.total);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const getPageCategoryData = async (categorySlug) => {
        setIsLoading(true);
        try {
            let productDataResponse = await CallApi(GetCategoryProductsAPI(categorySlug, currentPage));
            setProductData(productDataResponse.results);
            setTotalPage(productDataResponse.total);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const paginationChangeHandler = (event, value) => {
        setCurrentPage(value);
    };

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    // Create rtl cache
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
            {isLoading && <PageLoader isLoading={true} />}
            <Navbar />
            <div className={classes.main}>
                <Grid container direction="column">
                    <Grid item className={classes.container}>
                        <Container maxWidth="md">
                            <Breadcrumb items={[
                                { title: "محصولات" },
                            ]} />
                            <Grid container direction="column" className={classes.component}>
                                <Title text="مراحل ثبت سفارش" size="sm" />
                                <StepsOrdering productSteps />
                            </Grid>
                            {productData &&
                                <Grid container direction="column">
                                    <Grid container direction="row" spacing={3} className={classes.products}>
                                        {productData.map((item, index) => (
                                            <Product key={`productall_${index}`} title={item.name} link={item.slug} description={item.short_description} image={item.image} price={item.price} category={queryParams.get('category')} />
                                        ))}
                                    </Grid>
                                    {(totalPage && totalPage !== 1) &&
                                        <CacheProvider value={cacheRtl}>
                                            <ThemeProvider theme={rtltheme}>
                                                <Pagination onChange={paginationChangeHandler} defaultPage={currentPage} className={classes.pagination} count={totalPage} variant="outlined" />
                                            </ThemeProvider>
                                        </CacheProvider>
                                    }
                                </Grid>
                            }
                        </Container>
                    </Grid>
                </Grid>
                <ToUp />
            </div>
            <Footer />
        </>
    );
};

export default Products