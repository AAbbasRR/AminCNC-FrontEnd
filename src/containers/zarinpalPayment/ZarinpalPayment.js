import React, { useState, useEffect } from 'react';

import classes from './styles/ZarinpalPayment.module.scss';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import PageLoader from '../../components/loader/PageLoader';
import Price from '../../components/price/Price';
import Button from '../../components/button/Button';

import failed_payment from '../../assets/images/failed_payment.png';
import success_payment from '../../assets/images/success_payment.png';

import { resetAction } from '../../redux/actions/CartProductActions';

import { CheckPaymentFactorOrderAPI } from '../../api/Order';
import CallApi from "../../functions/CallApi";


const ZarinpalPayment = () => {
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const [queryParams, setQueryParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [successPayment, setSuccessPayment] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);

    useEffect(() => {
        let authrity = queryParams.get("Authority");
        let status = queryParams.get("Status");
        if (status && authrity) {
            if (status === "OK") {
                verifyPayment(status, authrity);
            };
        } else {
            history("/");
        };
    }, []);

    const verifyPayment = async (status, authrity) => {
        setIsLoading(true);
        try {
            let response = await CallApi(CheckPaymentFactorOrderAPI(status, authrity));
            setOrderDetail(response.result);
            setSuccessPayment(true);
            reduxDispatch(resetAction());
        } catch (error) {
            let error_response = error?.response?.data;
            setSuccessPayment(false);
            Object.keys(error_response).forEach(key => {
                enqueueSnackbar(error_response[key], { variant: "error" });
            });
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <>
            {isLoading && <PageLoader isLoading={true} />}
            <Box component="main" className={classes.main}>
                <Container maxWidth="md">
                    <Box className={classes.box}>
                        <Typography align="center" className={`title ${successPayment ? classes.successText : classes.errorText}`} variant="h5">
                            {successPayment ? "تراکنش موفق" : "تراکنش ناموفق"}
                        </Typography>
                        <LazyLoadImage src={successPayment ? success_payment : failed_payment} alt="payment status" className={classes.paymentStatus} />
                        {successPayment ?
                            <Stack>
                                {orderDetail &&
                                    <>
                                        <Typography align="center" className={`subtitle ${classes.textFlex}`} variant="subtitle2">
                                            پرداخت شما به مبلغ <Price price={orderDetail.total_price} size="md" /> با موفقیت انجام شد
                                        </Typography>
                                        <Typography align="center" className={`subtitle`} variant="subtitle2">
                                            کد رهگیری پرداخت: {orderDetail.ref_id}
                                        </Typography>
                                        <Typography align="center" className={`subtitle`} variant="subtitle2">
                                            کد رهگیری سفارش: {orderDetail.order_tracking_code}
                                        </Typography>
                                    </>
                                }
                            </Stack>
                            :
                            <Stack>
                                <Typography align="center" className={`subtitle`} variant="subtitle2">
                                    تراکنش شما ناموفق بود، لطفا پس از چند دقیقه دوباره تلاش کنید
                                </Typography>
                                <Typography align="center" className={`subtitle`} variant="subtitle2">
                                    اگر مبلغ از شما کسر شده است، پس از حداکثر ۷۲ ساعت به حساب شما مرجوع میشود
                                </Typography>
                            </Stack>
                        }
                        <Stack direction="row" spacing={3} alignItems="center">
                            <div />
                            <Button text="صفحه اصلی" link='/' />
                            <Button text="داشبورد" link='/dashboard' />
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default ZarinpalPayment;
