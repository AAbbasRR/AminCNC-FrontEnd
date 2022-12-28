import React, { useState } from 'react';

import classes from './styles/Newsletter.module.scss';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailRounded from '@mui/icons-material/EmailRounded';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import Loading from "../loader/Loading";

import { AddNewsletter } from "../../api/Newsletter";
import CallApi from "../../functions/CallApi";


const Newsletter = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const formTextFieldChangeHandler = (event, inputName) => {
        let newData = { ...formData };
        newData[inputName] = event.target.value;
        setFormData(newData);
    };
    const sendDataHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await CallApi(AddNewsletter(formData.name, formData.email));
            enqueueSnackbar("اطلاعات شما با موفقیت در خبرنامه ثبت شد", { variant: "success" });
            setFormData({
                name: "",
                email: "",
            });
        } catch (error) {
            console.log(error);
        };
        setIsLoading(false);
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
            {isLoading && <Loading isLoading={true} />}
            <div className={classes.newsletterBox}>
                <Typography variant='h6' className={`subtitle ${classes.title}`}>
                    ثبت نام در خبرنامه ایمیلی
                </Typography>
                <form autoComplete="off">
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={rtltheme}>
                            <div dir="rtl" className={classes.inputBox}>
                                <Box className={classes.inputIconBox}>
                                    <AccountCircle sx={{ color: 'white', mr: 1, my: 0.5 }} />
                                    <TextField onChange={(e) => formTextFieldChangeHandler(e, 'name')} value={formData.name} className={classes.textField} label="نام و نام خانوادگی" variant="standard" />
                                </Box>
                                <Box className={classes.inputIconBox}>
                                    <EmailRounded sx={{ color: 'white', mr: 1, my: 0.5 }} />
                                    <TextField onChange={(e) => formTextFieldChangeHandler(e, 'email')} value={formData.email} className={classes.textField} label="ایمیل" variant="standard" />
                                </Box>
                                <Button variant="outlined" color="inherit" disabled={isLoading} className={classes.submitButton} onClick={sendDataHandler}>
                                    ثبت
                                </Button>
                            </div>
                        </ThemeProvider>
                    </CacheProvider>
                </form>
            </div>
        </>
    );
};

export default Newsletter