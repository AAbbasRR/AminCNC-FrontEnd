import React, { useState, useEffect } from 'react';

import classes from './styles/Cart.module.scss';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import AddIcon from '@mui/icons-material/Add';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSnackbar } from 'notistack';

import PageLoader from '../../components/loader/PageLoader';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import Price from '../../components/price/Price';
import SelectItem from '../../components/input/SelectItem';

import { removeProductFromCartAction, resetAction } from '../../redux/actions/CartProductActions';

import { UserAddressesListAPI } from '../../api/User';
import { DeliveryModesListAPI, SubmitOrderAPI } from '../../api/Order';
import CallApi from '../../functions/CallApi';

const Cart = () => {
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const reduxCartData = useSelector(state => state.CartProductReducer);
    const { enqueueSnackbar } = useSnackbar();

    let factorTotalPayablePrice = reduxCartData.reduce((previousPrice, item) => {
        return previousPrice + item.price;
    }, 0);
    let factorTotalPrice = reduxCartData.reduce((previousPrice, item) => {
        let price = item.discountPrice ? item.discountPrice : item.price;
        return previousPrice + price;
    }, 0);
    let preparationTime = reduxCartData.reduce((previousTime, item) => {
        return previousTime + item.preparation_time;
    }, 0);

    const [isLoading, setIsLoading] = useState(false);
    const [deliveryModeData, setDeliveryModeData] = useState({
        listData: [],
        selected: null,
        error: false
    });
    const [addressesData, setAddressesData] = useState({
        listData: [],
        selected: null,
        error: false
    });
    const [orderDescription, setOrderDescription] = useState("");
    const [showSubmitCartDialog, setShowSubmitCartDialog] = useState(false);

    useEffect(() => {
        getOrderingData();
    }, []);

    const getOrderingData = async () => {
        setIsLoading(true);
        try {
            let deliveryDataNew = [];
            let responseDeliveryModesData = await CallApi(DeliveryModesListAPI());
            if (responseDeliveryModesData.length >= 1) {
                responseDeliveryModesData.map((item) => {
                    deliveryDataNew.push({
                        label: `${item.mode_name} - هزینه: ${item.price} `,
                        value: item.id,
                        price: item.price
                    });
                });
            } else {
                deliveryDataNew.push({
                    value: '',
                    label: 'خالی',
                    disabled: true
                });
            };
            setDeliveryModeData({
                ...deliveryModeData,
                listData: deliveryDataNew
            });

            let addressDataNew = [];
            let responseAddressData = await CallApi(UserAddressesListAPI());
            if (responseAddressData.data.length >= 1) {
                responseAddressData.data.map((item) => {
                    let address = item.address_description.length > 45 ? `${item.address_description.slice(0, 20)} ... ${item.address_description.slice(-20)}` : item.address_description;
                    addressDataNew.push({
                        label: `${item.post_code} - ${address} - ${item.receiver}`,
                        value: item.id
                    });
                });
            } else {
                addressDataNew.push({
                    value: '',
                    label: 'خالی',
                    disabled: true
                });
            };
            setAddressesData({
                ...addressesData,
                listData: addressDataNew,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const editShowModalAddressHandler = (product) => {
        history({
            pathname: `/singleProduct/${product.slug}`,
            search: `?editMaterialId=${product.material_id}`
        });
    };
    const deleteProductHandler = (product) => {
        reduxDispatch(removeProductFromCartAction(product.product_id, product.material_id));
    };
    const deliveryModeChangeHandler = (event) => {
        let deliveryNew = [...deliveryModeData.listData];
        let foundDelivery = deliveryNew.find(element => element.value === event.target.value);
        setDeliveryModeData({
            ...deliveryModeData,
            selected: foundDelivery,
            error: false
        });
    };
    const addressDataChangeHandler = (event) => {
        let addressNew = [...addressesData.listData];
        let foundAddress = addressNew.find(element => element.value === event.target.value);
        setAddressesData({
            ...addressesData,
            selected: foundAddress,
            error: false
        });
    };
    const orderDescriptionChangeHandler = (event) => {
        console.log(event.target.value)
        setOrderDescription(event.target.value);
    };
    const showSubmitCartDialogHandler = () => {
        setShowSubmitCartDialog(true);
    };
    const unshowSubmitCartDialogHandler = () => {
        setShowSubmitCartDialog(false);
    };
    const submitOrderHandler = async () => {
        setIsLoading(true);
        try {
            if (deliveryModeData.selected && addressesData.selected) {
                CallApi(SubmitOrderAPI(reduxCartData, orderDescription, addressesData.selected.value, deliveryModeData.selected.value));
                unshowSubmitCartDialogHandler();
                enqueueSnackbar("سفارش شما با موفقیت ثبت شد", { variant: "success" });
                reduxDispatch(resetAction());
            } else {
                if (!deliveryModeData.selected) {
                    enqueueSnackbar("لطفا نوع ارسال سفارش را انتخاب کنید", { variant: "error" });
                    setDeliveryModeData({
                        ...deliveryModeData,
                        error: true
                    });
                };
                if (!addressesData.selected) {
                    enqueueSnackbar("لطفا آدرس ارسال سفارش را انتخاب کنید", { variant: "error" });
                    setAddressesData({
                        ...addressesData,
                        error: true
                    });
                };
            };
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
            {isLoading && <PageLoader isLoading={true} />}
            <Dialog
                open={showSubmitCartDialog}
                onClose={unshowSubmitCartDialogHandler}
            >
                <DialogContent>
                    آیا از ثبت سفارش خود مطمئن هستید؟ پس از ثبت سفارش امکان تغییر یا لغو سفارش به صورت سیستمی وجود ندارد.
                </DialogContent>
                <DialogActions>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <div />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={unshowSubmitCartDialogHandler}
                        >
                            خیر
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={submitOrderHandler}
                        >
                            بله
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <div className={classes.main}>
                <Sidebar />
                <Navbar />
                <Grid container direction="row" spacing={3} className={classes.container}>
                    <Grid item xs={12} sm={12}>
                        <Paper elevation={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" align="right" className={`subtitle ${classes.cardHeader}`}>
                                        سبد خرید
                                    </Typography>
                                    <Divider />
                                    <CacheProvider value={cacheRtl}>
                                        <ThemeProvider theme={rtltheme}>
                                            <TableContainer className={classes.table}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={`subtitle`}>
                                                                محصول
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                قیمت واحد
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                تعداد
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                قیمت کل
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                تخفیف
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                &nbsp;
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {reduxCartData.map((item, index) => (
                                                            <TableRow key={`cartProduct_${index}`}>
                                                                <TableCell>
                                                                    <div className={classes.productCell}>
                                                                        <LazyLoadImage className={classes.productImage} src={item.image} alt={item.slug} />
                                                                        <div className={classes.productNamesCell}>
                                                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                                                {item.name}
                                                                            </Typography>
                                                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                                                {item.material_name}
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <Price className={classes.centerText} price={item.ones_price} size="md" />
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    {item.number}
                                                                </TableCell>
                                                                <TableCell className={`${classes.tableCell}`}>
                                                                    <div className={classes.priceCell}>
                                                                        {item.discountPrice &&
                                                                            <Price className={classes.centerText} price={item.discountPrice} discounted size="md" />
                                                                        }
                                                                        <Price className={classes.centerText} price={item.price} size="md" />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    {item.discountPrice ?
                                                                        <Typography variant="caption" className={`caption`}>
                                                                            بیشتر از {item.discountSelected.number} عدد = {item.discountSelected.percent} درصد تخفیف
                                                                        </Typography>
                                                                        :
                                                                        "-"
                                                                    }
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <Stack direction="row" spacing={2}>
                                                                        <Tooltip title="ویرایش محصول">
                                                                            <IconButton onClick={() => editShowModalAddressHandler(item)} aria-label="edit product">
                                                                                <EditIcon
                                                                                    sx={{
                                                                                        fontSize: 23,
                                                                                    }}
                                                                                    className={classes.EditIconAction} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="حذف محصول">
                                                                            <IconButton onClick={() => deleteProductHandler(item)} aria-label="remove product">
                                                                                <DeleteIcon
                                                                                    sx={{
                                                                                        fontSize: 23,
                                                                                    }}
                                                                                    className={classes.RemoveIconAction} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </ThemeProvider>
                                    </CacheProvider>
                                    <div className={classes.factorDetails}>
                                        <Grid container direction="row" spacing={5}>
                                            <Grid item xs={12} md={6}>
                                                <div className={classes.selectInput}>
                                                    <DeliveryDiningIcon />
                                                    <SelectItem error={deliveryModeData.error} label='نوع ارسال' items={deliveryModeData.listData} size="small" onChange={deliveryModeChangeHandler} fullWidth={true} variant="outlined" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <div className={classes.selectInput}>
                                                    <PersonPinCircleIcon />
                                                    <SelectItem error={addressesData.error} label='آدرس ارسال' items={addressesData.listData} size="small" onChange={addressDataChangeHandler} fullWidth variant="outlined" />
                                                    <Tooltip title="اضافه کردن">
                                                        <IconButton onClick={() => history('/dashboard/addresses')} aria-label="add address">
                                                            <AddIcon className={classes.addIconAction} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <div className={classes.factorDetailItem}>
                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                مبلغ کل:
                                            </Typography>
                                            <Price price={factorTotalPrice} size="md" />
                                        </div>
                                        <div className={classes.factorDetailItem}>
                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                تخفیف / سود شما از این سفارش:
                                            </Typography>
                                            <Price price={factorTotalPrice - factorTotalPayablePrice} size="md" />
                                        </div>
                                        <div className={classes.factorDetailItem}>
                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                مبلغ ارسال:
                                            </Typography>
                                            {deliveryModeData.selected ?
                                                Number(deliveryModeData.selected.price) ?
                                                    <Price price={Number(deliveryModeData.selected.price)} size="md" />
                                                    :
                                                    deliveryModeData.selected.price
                                                :
                                                "محاسبه نشده"
                                            }
                                        </div>
                                        <div className={classes.factorDetailItem}>
                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                مبلغ قابل پرداخت:
                                            </Typography>
                                            {deliveryModeData.selected ?
                                                Number(deliveryModeData.selected.price) ?
                                                    <Price price={factorTotalPayablePrice + Number(deliveryModeData.selected.price)} size="md" />
                                                    :
                                                    <Price price={factorTotalPayablePrice} size="md" />
                                                :
                                                <Price price={factorTotalPayablePrice} size="md" />
                                            }
                                        </div>
                                        <div className={classes.factorDetailItem}>
                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                زمان آماده سازی:
                                            </Typography>
                                            {preparationTime !== 0 ?
                                                `${preparationTime} روزکاری`
                                                :
                                                "محاسبه نشده"
                                            }
                                        </div>
                                        <Grid container direction="row" spacing={3}>
                                            <Grid item xs={12} md={10}>
                                                <CacheProvider value={cacheRtl}>
                                                    <ThemeProvider theme={rtltheme}>
                                                        <TextField
                                                            onChange={orderDescriptionChangeHandler}
                                                            value={orderDescription}
                                                            multiline
                                                            rows={3}
                                                            label="توضیحات سفارش"
                                                            fullWidth
                                                            placeholder='به عنوان مثال: حکاکی اسم شما روی محصول انتخابی'
                                                        />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Button disabled={reduxCartData.length ? false : true} color="success" className={classes.submitOrderBtn} variant="contained" onClick={showSubmitCartDialogHandler}>
                                                    ثبت سفارش
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                </Grid >
            </div>
        </>
    );
};

export default Cart