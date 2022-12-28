import React, { useState, useEffect } from 'react';

import classes from './styles/Home.module.scss';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';
import Title from '../../components/title/Title';
import Product from '../../components/product/Product';
import Button from '../../components/button/Button';
import StepsOrdering from '../../components/stepsOrdering/StepsOrdering';
import FrequentlyQuestion from '../../components/frequentlyQuestion/FrequentlyQuestion';
import ToUp from '../../components/toUp/ToUp';
import Footer from '../../components/footer/Footer';

import cover from '../../assets/images/cover.jpeg';
import vertical from '../../assets/images/vertical.jpeg';
import horizontal from '../../assets/images/horizontal.jpeg';
import double1 from '../../assets/images/double1.jpeg';
import double2 from '../../assets/images/double2.jpeg';
import services1 from '../../assets/images/services1.jpeg';
import services2 from '../../assets/images/services2.jpeg';
import contactus from '../../assets/images/contactus.png';

import onlineـdesign from '../../assets/svg/onlineـdesign.svg';
import easy_order from '../../assets/svg/easy_order.svg';
import fast_high from '../../assets/svg/fast_high.svg';
import online_support from '../../assets/svg/online_support.svg';

import { IndexProductsAPI } from "../../api/Products";
import { IndexFrequentlyQuestionAPI } from "../../api/FrequentlyQuestion";
import { SiteOptionsAPI } from "../../api/Options";
import CallApi from "../../functions/CallApi";

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [frequentlyQuestionData, setFrequentlyQuestionData] = useState(null);
    const [optionsData, setOptionsData] = useState(null);

    useEffect(() => {
        getPageDatas();
    }, []);

    const getPageDatas = async () => {
        setIsLoading(true);
        try {
            let productResponse = await CallApi(IndexProductsAPI());
            let frequentlyQuestionResponse = await CallApi(IndexFrequentlyQuestionAPI());
            let optionsDataResponse = await CallApi(SiteOptionsAPI());
            setProductData(productResponse);
            setFrequentlyQuestionData(frequentlyQuestionResponse);
            setOptionsData(optionsDataResponse);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <>
            {isLoading && <PageLoader isLoading={true} />}
            <Navbar />
            <div className={classes.main}>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Container maxWidth="xl">
                            <LazyLoadImage src={cover} className={classes.cover} />
                        </Container>
                    </Grid>
                    <Grid item className={classes.container}>
                        <Container maxWidth="md">
                            <Grid container direction="row" className={classes.abilities} id="abilities">
                                <Grid item xs={6} md={3}>
                                    <LazyLoadImage src={onlineـdesign} alt="online design" />
                                    <Typography className={`subtitle ${classes.abilityTitle}`} align="center" variant="subtitle2">
                                        خدمات در طراحی
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LazyLoadImage src={easy_order} alit="easy order" />
                                    <Typography className={`subtitle ${classes.abilityTitle}`} align="center" variant="subtitle2">
                                        ثبت سفارش‌ سریع و آسان
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LazyLoadImage src={fast_high} alit="fast high" />
                                    <Typography className={`subtitle ${classes.abilityTitle}`} align="center" variant="subtitle2">
                                        سرعت، کیفیت در برش
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <LazyLoadImage src={online_support} alit="online support" />
                                    <Typography className={`subtitle ${classes.abilityTitle}`} align="center" variant="subtitle2">
                                        مشاوره و پشتیبانی رایگان
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container direction="column" id="products">
                                <Title text="محصولات" />
                                <Hidden smDown>
                                    <div className={classes.productCategories}>
                                        <div className={classes.horizontalCategoryBox}>
                                            <div className={classes.doubleCategoryBox}>
                                                <LazyLoadImage src={double1} className={classes.categoryItem} />
                                                <LazyLoadImage src={double2} className={classes.categoryItem} />
                                            </div>
                                            <div className={classes.singleCategoryBox}>
                                                <LazyLoadImage src={horizontal} className={classes.categoryItem} />
                                            </div>
                                        </div>
                                        <div className={classes.verticalCategoryBox}>
                                            <LazyLoadImage src={vertical} className={classes.categoryItem} />
                                        </div>
                                    </div>
                                </Hidden>
                                <Hidden smUp>
                                    <div className={classes.responsiveProductCategories}>
                                        <div className={classes.responsiveTopCategories}>
                                            <div className={classes.responsiveDoubleCategoryBox}>
                                                <LazyLoadImage src={double1} className={classes.categoryItem} />
                                                <LazyLoadImage src={double2} className={classes.categoryItem} />
                                            </div>
                                            <div className={classes.responsiveVerticalCategoryBox}>
                                                <LazyLoadImage src={vertical} className={classes.categoryItem} />
                                            </div>
                                        </div>
                                        <div className={classes.responsiveBotCategories}>
                                            <LazyLoadImage src={horizontal} className={classes.categoryItem} />
                                        </div>
                                    </div>
                                </Hidden>
                                {productData &&
                                    <>
                                        <Grid container direction="row" spacing={3} className={classes.products}>
                                            {productData.map((item, index) => (
                                                <Product key={`productindex_${index}`} title={item.name} link={item.slug} description={item.short_description} image={item.image} price={item.price} />
                                            ))}
                                        </Grid>
                                        <Button text="تمام محصولات" link='/products' />
                                    </>
                                }
                            </Grid>
                            <Grid container direction="column" className={classes.component}>
                                <Title text="مراحل ثبت سفارش" size="sm" />
                                <StepsOrdering productSteps />
                            </Grid>
                            <Grid container direction="column" className={classes.component} id="services">
                                <Title text="خدمات" />
                                <Typography align="center" variant="subtitle1" className={`caption ${classes.slogan}`}>
                                    ما با ارائه خدمات زیر، همواره به دنبال جلب رضایت مشتریانمان هستیم.
                                </Typography>
                                <Grid container direction="row" spacing={2} className={classes.servicesBox}>
                                    <Grid item xs={12} sm={6} className={classes.servicesItem}>
                                        <LazyLoadImage src={services1} className={classes.servicesImage} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} className={classes.servicesItem}>
                                        <LazyLoadImage src={services2} className={classes.servicesImage} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction="column" className={classes.component}>
                                <Title text="مراحل درخواست و ثبت خدمات" size="sm" />
                                <StepsOrdering />
                            </Grid>
                            {frequentlyQuestionData &&
                                <Grid container direction="column" className={classes.component} id="frequentlyQuestions">
                                    <Title text="سوالات متداول" />
                                    <Grid container direction="column" spacing={3} className={classes.content}>
                                        {frequentlyQuestionData.map((item, index) => (
                                            <FrequentlyQuestion key={`frequentlyQuestionDataIndex_${index}`} question={item.question} answer={item.answer} />
                                        ))}
                                    </Grid>
                                    <Button text="تمام سوالات متداول" link="/frequentlyQuestions" topSpacing />
                                </Grid>
                            }
                            {optionsData &&
                                <Grid container direction="row" spacing={3} className={classes.component} id="contactus">
                                    <Title text="تماس با ما" />
                                    <Grid item xs={12} sm={4} className={classes.contactusItem}>
                                        <Typography className={`caption ${classes.contactusText}`} align="center" variant="subtitle2">
                                            شنبه تا چهارشنبه از ساعت {optionsData[0].week_hours_work} و پنجشنبه‌ها از ساعت {optionsData[0].weekend_hours_work} پاسخگوی شما هستیم.
                                        </Typography>
                                        <Typography className={`caption ${classes.contactusText}`} align="center" variant="subtitle2">
                                            <SupportAgentIcon className={classes.contactusIcon} /> آدرس: {optionsData[0].address}
                                        </Typography>
                                        <Typography className={`caption ${classes.contactusText}`} align="center" variant="subtitle2">
                                            <LocationOnIcon className={classes.contactusIcon} /> تلفن تماس و مشاوره رایگان: {optionsData[0].phone_number}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8} className={classes.contactusItem}>
                                        <LazyLoadImage src={contactus} alt="contactus" className={classes.contactusImage} />
                                    </Grid>
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

export default Home