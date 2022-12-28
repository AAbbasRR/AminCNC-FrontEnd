import React, { useState, useEffect } from 'react';

import classes from './styles/ActiveAccount.module.scss';

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
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';

import auth_bg_top from '../../assets/svg/auth_bg_top.svg';

import { activeAccountAction } from '../../redux/actions/UserActions';

import { ActivateAccountAPI, ResendOTPCodeAPI } from "../../api/Auth";
import CallApi from "../../functions/CallApi";
import useTimer from "../../functions/useTimer";


const ActiveAccount = () => {
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const userData = useSelector(state => state.UserReducer);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState("");
    const [dataError, setDataError] = useState({
        error: false,
        message: "",
    });
    const [resendError, setResendError] = useState({
        error: false,
        message: "",
    });
    const [timerStart, setTimerStart] = useState({
        isEnable: false,
        time: 120
    });

    let { minutes, seconds, finishTimer } = useTimer(timerStart.time, timerStart.isEnable);

    useEffect(() => {
        if (!userData.mobile_number) {
            history('/auth/register')
        } else if (userData.registerSendOtpCodeStatus) {
            setTimerStart({
                isEnable: true,
                time: 120
            });
        }
    }, []);
    useEffect(() => {
        if (finishTimer) {
            setTimerStart({ ...timerStart, isEnable: false });
            setResendError({
                error: false,
                message: "",
            });
        }
    }, [finishTimer]);

    const changeDataHandle = (event, textField) => {
        setDataError({
            error: false,
            message: ""
        });
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= 5) {
            setData(onlyNums);
        }
    };
    const activateAccount = async () => {
        setIsLoading(true);
        try {
            await CallApi(ActivateAccountAPI(userData.mobile_number, data));
            enqueueSnackbar("حساب شما با موفقیت فعال شد", { variant: "success" });
            reduxDispatch(activeAccountAction());
            history('/auth/login');
        } catch (error) {
            let response = error?.response?.data;
            let dataErrorNew;
            Object.keys(response).forEach(key => {
                dataErrorNew = {
                    error: true,
                    message: response[key]
                };
            });
            setDataError({ ...dataErrorNew });
        } finally {
            setIsLoading(false);
        };
    };
    const formValidation = async () => {
        let schema = yup.object().shape({
            otp_code: yup.string().required().test("len", "otp_code must be 5 charecter", (otp_code) => otp_code.length === 5)
        });
        try {
            await schema.validate({ otp_code: data }, { abortEarly: false });
            return true;
        } catch (error) {
            let errorMessage = "";
            error.errors.map((item) => {
                switch (item) {
                    case "otp_code is a required field":
                        errorMessage = "کد فعالسازی نباید خالی باشد";
                        break;
                    case "otp_code must be 5 charecter":
                        errorMessage = "کد فعالسازی باید ۵ رقم باشد";
                        break;
                    default:
                        break;
                };
                return null;
            });
            setDataError({
                error: true,
                message: errorMessage
            });
            return false;
        };
    };
    const submitFormHandler = async () => {
        let isFormValid = await formValidation();
        if (isFormValid) {
            activateAccount();
        }
    };
    const resentOTPCode = async () => {
        setIsLoading(true);
        try {
            await CallApi(ResendOTPCodeAPI(userData.mobile_number));
            enqueueSnackbar("کد فعالسازی مجددا به شما ارسال شد", { variant: "success" });
            setTimerStart({
                isEnable: true,
                time: 120
            });
        } catch (error) {
            let response = error?.response?.data;
            let dataErrorNew;
            if (response?.time) {
                setTimerStart({
                    isEnable: true,
                    time: Number(response.time)
                });
                dataErrorNew = {
                    error: true,
                    message: response.message
                };
            } else {
                Object.keys(response).forEach(key => {
                    dataErrorNew = {
                        error: true,
                        message: response[key]
                    };
                });
            }
            setResendError({ ...dataErrorNew });
        } finally {
            setIsLoading(false);
        };
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
                                    فعالسازی حساب کاربری
                                </Typography>
                                <div className={classes.formControll}>
                                    <TextField
                                        required
                                        variant="filled"
                                        id="otpcode-input"
                                        className={classes.input}
                                        label="کد فعال سازی"
                                        onChange={changeDataHandle}
                                        value={data}
                                        error={dataError.error}
                                        helperText={dataError.message}
                                    />
                                    <div className={classes.btnGroup}>
                                        <div className={classes.resendGroup}>
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                className={classes.submitBtn}
                                                onClick={resentOTPCode}
                                                disabled={timerStart.isEnable}
                                            >
                                                {timerStart.isEnable ? `${minutes}:${seconds}` : 'ارسال مجدد کد فعالسازی'}
                                            </Button>
                                            {resendError.error &&
                                                <Typography variant="caption" className={`caption ${classes.resendError}`} align="right">
                                                    {resendError.message}
                                                </Typography>
                                            }
                                        </div>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            className={classes.submitBtn}
                                            onClick={submitFormHandler}
                                            disabled={isLoading}
                                        >
                                            ثبت
                                        </Button>
                                    </div>
                                </div>
                                <div className={classes.footer}>
                                    <Typography variant="subtitle2" className={`caption ${classes.footerTitle}`} align="right">
                                        حساب کاربری دارید؟ <Link className={`link ${classes.link}`} to="/auth/login" >ورود</Link>
                                    </Typography>
                                    <Typography variant="subtitle2" className={`caption ${classes.footerTitle}`} align="right">
                                        شماره موبایل درست است؟<Link className={`link ${classes.link}`} to="/auth/register" >بازگشت</Link>
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

export default ActiveAccount