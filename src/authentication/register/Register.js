import React, { useState } from 'react';

import classes from './styles/Register.module.scss';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link, useNavigate } from 'react-router-dom';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';

import auth_bg_top from '../../assets/svg/auth_bg_top.svg';

import { useDispatch } from 'react-redux';
import { sendActiveAccountCodeAction } from '../../redux/actions/UserActions';

import { RegisterAPI } from "../../api/Auth";
import CallApi from "../../functions/CallApi";


const Register = () => {
    const reduxDispatch = useDispatch();
    const history = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        mobile_number: "",
        password: "",
        re_password: ""
    });
    const [dataError, setDataError] = useState({
        mobile_number: {
            error: false,
            message: ""
        },
        password: {
            error: false,
            message: ""
        },
        re_password: {
            error: false,
            message: ""
        },
    });

    const changeDataHandle = (event, textField) => {
        setDataError({
            mobile_number: {
                error: false,
                message: ""
            },
            password: {
                error: false,
                message: ""
            },
            re_password: {
                error: false,
                message: ""
            },
        });
        if (textField === "mobile_number") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length > 11) {
            } else {
                let dataNew = { ...data };
                dataNew[textField] = onlyNums;
                setData({ ...dataNew });
            }
        } else {
            let dataNew = { ...data };
            dataNew[textField] = event.target.value;
            setData({ ...dataNew });
        }
    };

    const submitFormHandler = async () => {
        const regex = /^{?(0?9[0-9]{9,9}}?)$/g;
        let dataErrorNew = { ...dataError };
        let error = false;

        if (!data.mobile_number.match(regex)) {
            dataErrorNew.mobile_number = {
                error: true,
                message: "لطفا شماره موبایل صحیح وارد کنید"
            };
            error = true;
        }
        if (data.password === "") {
            dataErrorNew.password = {
                error: true,
                message: "رمزعبور نباید خالی باشد"
            };
            error = true;
        }
        if (data.re_password === "") {
            dataErrorNew.re_password = {
                error: true,
                message: "تکرار رمزعبور نباید خالی باشد"
            };
            error = true;
        }
        if (data.password !== data.re_password) {
            dataErrorNew.re_password = {
                error: true,
                message: "رمز عبور و تکرار آن باهم یکی نیستند"
            };
            error = true;
        }
        if (error) {
            setDataError({ ...dataErrorNew });
        } else {
            setIsLoading(true);
            try {
                await CallApi(RegisterAPI(data.mobile_number, data.password, data.re_password));
                reduxDispatch(sendActiveAccountCodeAction(data.mobile_number));
                history('/auth/activeAccount');
            } catch (error) {
                let response = error?.response?.data;
                Object.keys(response).forEach(key => {
                    dataErrorNew[key] = {
                        error: true,
                        message: response[key]
                    };
                });
                setDataError({ ...dataErrorNew });
            } finally {
                setIsLoading(false);
            };
        }
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
            <Container fixed className={classes.main}>
                <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={rtltheme}>
                        <div className={classes.authBox}>
                            <LazyLoadImage src={auth_bg_top} className={classes.authBGTop} />
                            <LazyLoadImage src={auth_bg_top} className={classes.authBGBot} />
                            <div className={classes.content}>
                                <Typography variant="h5" className={`title ${classes.title}`} align="center">
                                    ثبت نام
                                </Typography>
                                <div className={classes.formControll}>
                                    <TextField
                                        required
                                        variant="filled"
                                        id="mobilenumber-input"
                                        className={classes.input}
                                        label="شماره موبایل"
                                        onChange={(event) => changeDataHandle(event, "mobile_number")}
                                        value={data.mobile_number}
                                        error={dataError.mobile_number.error}
                                        helperText={dataError.mobile_number.message}
                                        placeholder="09121212122"
                                    />
                                    <TextField
                                        required
                                        variant="filled"
                                        id="password-input"
                                        className={classes.input}
                                        label="رمزعبور"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={(event) => changeDataHandle(event, "password")}
                                        value={data.password}
                                        error={dataError.password.error}
                                        helperText={dataError.password.message}
                                    />
                                    <TextField
                                        required
                                        variant="filled"
                                        id="re_password_input"
                                        className={classes.input}
                                        label="تکرار رمز عبور"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={(event) => changeDataHandle(event, "re_password")}
                                        value={data.re_password}
                                        error={dataError.re_password.error}
                                        helperText={dataError.re_password.message}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        className={classes.submitBtn}
                                        onClick={submitFormHandler}
                                        disabled={isLoading}
                                    >
                                        ثبت نام
                                    </Button>
                                </div>
                                <div className={classes.footer}>
                                    <Typography variant="subtitle2" className={`caption ${classes.footerTitle}`} align="right">
                                        حساب کاربری دارید؟ <Link className={`link ${classes.link}`} to="/auth/login" >ورود</Link>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </ThemeProvider>
                </CacheProvider>
            </Container>
        </>
    );
};

export default Register