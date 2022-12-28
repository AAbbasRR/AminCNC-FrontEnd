import React, { useState } from 'react';

import classes from './styles/Login.module.scss';

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
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';

import auth_bg_top from '../../assets/svg/auth_bg_top.svg';

import { sendActiveAccountCodeAction, loginAction } from '../../redux/actions/UserActions';

import { LoginAPI } from "../../api/Auth";
import CallApi from "../../functions/CallApi";


const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const reduxDispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        mobile_number: "",
        password: "",
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
    });

    const mobileNumberchangeHandle = (event) => {
        setDataError({
            ...dataError, mobile_number: {
                error: false,
                message: ""
            }
        });
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= 11) {
            setData({ ...data, mobile_number: onlyNums });
        };
    };
    const passwordchangeHandle = (event) => {
        setDataError({
            ...dataError, password: {
                error: false,
                message: ""
            }
        });
        setData({ ...data, password: event.target.value });
    };
    const proccessLogin = async () => {
        setIsLoading(true);
        try {
            let response = await CallApi(LoginAPI(data.mobile_number, data.password));
            reduxDispatch(loginAction(response?.result));
            history('/dashboard');
        } catch (error) {
            let response = error?.response?.data;
            let dataErrorNew = { ...dataError };
            if (error?.response?.data?.status === 'False') {
                if (error?.response?.data?.accountActivationError === 'True') {
                    reduxDispatch(sendActiveAccountCodeAction(data.mobile_number));
                    history('/auth/activeAccount');
                } else {
                    enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
                }
            } else {
                Object.keys(response).forEach(key => {
                    dataErrorNew[key] = {
                        error: true,
                        message: response[key]
                    };
                });
            }
            setDataError({ ...dataErrorNew });
        } finally {
            setIsLoading(false);
        };
    };
    const formValidation = async () => {
        let schema = yup.object().shape({
            mobile_number: yup.string().required().test("mobile", "mobile_number not valid", (mobile_number) => mobile_number.match(/^{?(0?9[0-9]{9,9}}?)$/g)),
            password: yup.string().required()
        });
        try {
            await schema.validate({ ...data }, { abortEarly: false });
            return true;
        } catch (error) {
            let errorMessage = { ...dataError };
            error.errors.map((item) => {
                switch (item) {
                    case "mobile_number is a required field":
                        errorMessage.mobile_number.error = true;
                        errorMessage.mobile_number.message = "شماره موبایل نباید خالی باشد";
                        break;
                    case "password is a required field":
                        errorMessage.password.error = true;
                        errorMessage.password.message = "رمزعبور نباید خالی باشد";
                        break;
                    case "mobile_number not valid":
                        errorMessage.mobile_number.error = true;
                        errorMessage.mobile_number.message = "شماره موبایل معتبر نیست";
                        break;
                    default:
                        break;
                };
                return null;
            });
            setDataError({ ...errorMessage });
            return false;
        };
    };
    const submitFormHandler = async () => {
        let isFormValid = await formValidation();
        if (isFormValid) {
            proccessLogin();
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
                                    ورود
                                </Typography>
                                <div className={classes.formControll}>
                                    <TextField
                                        required
                                        variant="filled"
                                        id="mobilenumber-input"
                                        className={classes.input}
                                        label="شماره موبایل"
                                        onChange={mobileNumberchangeHandle}
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
                                        onChange={passwordchangeHandle}
                                        value={data.password}
                                        error={dataError.password.error}
                                        helperText={dataError.password.message}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        className={classes.submitBtn}
                                        onClick={submitFormHandler}
                                        disabled={isLoading}
                                    >
                                        ورود
                                    </Button>
                                </div>
                                <div className={classes.footer}>
                                    <Typography variant="subtitle2" className={`caption ${classes.footerTitle}`} align="right">
                                        حساب کاربری ندارید؟ <Link className={`link ${classes.link}`} to="/auth/register" >ثبت نام</Link>
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

export default Login