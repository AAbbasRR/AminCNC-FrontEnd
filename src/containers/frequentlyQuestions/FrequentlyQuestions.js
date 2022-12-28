import React, { useState, useEffect } from 'react';

import classes from './styles/FrequentlyQuestions.module.scss';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useParams } from 'react-router-dom';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Title from '../../components/title/Title';
import FrequentlyQuestion from '../../components/frequentlyQuestion/FrequentlyQuestion';
import ToUp from '../../components/toUp/ToUp';
import Footer from '../../components/footer/Footer';

import { AllFrequentlyQuestionAPI } from "../../api/FrequentlyQuestion";
import CallApi from "../../functions/CallApi";

const FrequentlyQuestions = () => {
    let { page } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [totalPage, setTotalPage] = useState(null);
    const [frequentlyQuestionData, setFrequentlyQuestionData] = useState(null);

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page));
        } else {
            setCurrentPage(1);
        }
    }, []);
    useEffect(() => {
        if (currentPage) getPageData();
    }, [currentPage]);

    const getPageData = async () => {
        setIsLoading(true);
        try {
            let frequentlyQuestionResponse = await CallApi(AllFrequentlyQuestionAPI(currentPage));
            setFrequentlyQuestionData(frequentlyQuestionResponse.results);
            setTotalPage(frequentlyQuestionResponse.total);
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
                                { title: "سوالات متداول" },
                            ]} />
                            {frequentlyQuestionData &&
                                <Grid container direction="column" className={classes.component} id="frequentlyQuestions">
                                    <Title text="سوالات متداول" />
                                    <Grid container direction="column" spacing={3} className={classes.content}>
                                        {frequentlyQuestionData.map((item, index) => (
                                            <FrequentlyQuestion key={`FrequentlyQuestion_${index}`} question={item.question} answer={item.answer} />
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

export default FrequentlyQuestions