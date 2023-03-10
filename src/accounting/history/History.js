import React, { useState, useEffect } from "react";

import classes from './styles/History.module.scss';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditIcon from '@mui/icons-material/Edit';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import PageLoader from '../../components/loader/PageLoader';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import Price from '../../components/price/Price';

import ProductHistory from '../components/productHistory/ProductHistory';

import { OrderHistoryAPI, EditOrderAPI } from '../../api/Order';
import CallApi from '../../functions/CallApi';

const History = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [dialogShowData, setDialogShowData] = useState({
        show: false,
        data: []
    })
    const [historyData, setHistoryData] = useState([]);
    const [editOrderDescriptionDialog, setEditOrderDescriptionDialog] = useState({
        show: false,
        description: "",
        orderTrackingCode: null
    });

    useEffect(() => {
        getHistoryData();
    }, []);

    const getHistoryData = async () => {
        setIsLoading(true);
        try {
            let response = await CallApi(OrderHistoryAPI());
            setHistoryData(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const setShowDialogHandler = (data) => {
        setDialogShowData({
            show: true,
            data: data
        });
    };
    const setUnShowDialogHandler = () => {
        setDialogShowData({
            show: false,
            data: []
        });
    };
    const showEditOrderDialogHandler = (orderTrackingCode) => {
        setEditOrderDescriptionDialog({
            ...editOrderDescriptionDialog,
            show: true,
            orderTrackingCode
        });
    };
    const unshowEditOrderDialogHandler = () => {
        setEditOrderDescriptionDialog({
            show: false,
            description: "",
            orderTrackingCode: null
        });
    };
    const changeOrderDescriptionHandler = (event) => {
        setEditOrderDescriptionDialog({
            ...editOrderDescriptionDialog,
            description: event.target.value
        });
    };
    const submitEditDescriptionOrderHandler = async () => {
        setIsLoading(true);
        try {
            await CallApi(EditOrderAPI(editOrderDescriptionDialog.orderTrackingCode, editOrderDescriptionDialog.description));
            enqueueSnackbar("???? ???????????? ???????????? ????", { variant: "success" });
            await getHistoryData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            unshowEditOrderDialogHandler();
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
            <ProductHistory isOpen={dialogShowData.show} closeHandler={setUnShowDialogHandler} data={dialogShowData.data} />
            <Dialog
                open={editOrderDescriptionDialog.show}
                onClose={unshowEditOrderDialogHandler}
                fullWidth
            >
                <DialogTitle>
                    ???????????? ??????????
                </DialogTitle>
                <DialogContent>
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={rtltheme}>
                            <TextField
                                onChange={changeOrderDescriptionHandler}
                                value={editOrderDescriptionDialog.description}
                                multiline
                                rows={3}
                                label="?????????????? ??????????"
                                fullWidth
                                placeholder='???? ?????????? ????????: ?????????? ?????? ?????? ?????? ?????????? ??????????????'
                                className={classes.editDescription}
                            />
                        </ThemeProvider>
                    </CacheProvider>
                </DialogContent>
                <DialogActions>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <div />
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={unshowEditOrderDialogHandler}
                        >
                            ????????
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={submitEditDescriptionOrderHandler}
                        >
                            ????????????
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
                                        ?????? ????????
                                    </Typography>
                                    <Divider />
                                    <CacheProvider value={cacheRtl}>
                                        <ThemeProvider theme={rtltheme}>
                                            <TableContainer className={classes.table}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ???? ????????????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ?????????? ?????? ??????????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ?????? ???????? ???????????? ??????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ?????? ????????????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ?????? ??????????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                ?????????? ??????????
                                                            </TableCell>
                                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                                &nbsp;
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {historyData.map((item, index) => (
                                                            <TableRow key={`orderHistory_${index}`}>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <div className={classes.rowComp}>
                                                                        {item.description &&
                                                                            <Tooltip title={item.description}>
                                                                                <DescriptionOutlinedIcon size="small" />
                                                                            </Tooltip>
                                                                        }
                                                                        <Typography variant="caption" className={`caption`}>
                                                                            {item.tracking_code}
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    {item.submit_date}
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <Price className={classes.centerText} price={Number(item.total_price)} size="md" />
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <div className={classes.columnComp}>
                                                                        <Typography variant="subtitle2" className={`caption`}>
                                                                            {item.user_and_address.address_description.length > 45 ? `${item.user_and_address.address_description.slice(0, 20)} ... ${item.user_and_address.address_description.slice(-20)}` : item.user_and_address.address_description}
                                                                        </Typography>
                                                                        <Typography variant="caption" className={`caption`}>
                                                                            ????????????: {item.user_and_address.post_code}
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <div className={classes.columnComp}>
                                                                        <Typography variant="caption" className={`caption`}>
                                                                            {item.delivery_mode.mode_name}
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <Typography color="success" variant="caption" className={`caption ${item.status === "SUC" ? classes.successText : item.status === "CNS" ? classes.dangerText : classes.warningText}`}>
                                                                        {item.status === "SUC" ? "?????????? ??????" : item.status === "CNS" ? "?????? ??????" : item.status === "AWC" ? "???? ???????????? ??????????" : item.status === "PRE" ? "???? ?????? ?????????? ????????" : "????????????"}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                                    <Stack direction="row" spacing={1}>
                                                                        <Tooltip title="???????? ??????????????">
                                                                            <IconButton onClick={() => setShowDialogHandler(item.products)} aria-label="order products">
                                                                                <ShoppingCartIcon
                                                                                    sx={{
                                                                                        fontSize: 23,
                                                                                    }}
                                                                                    className={classes.orderProducts} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        {item.status === "AWC" &&
                                                                            <Tooltip title="???????????? ?????????????? ??????????">
                                                                                <IconButton onClick={() => showEditOrderDialogHandler(item.tracking_code)} aria-label="edit order">
                                                                                    <EditIcon
                                                                                        sx={{
                                                                                            fontSize: 23,
                                                                                        }}
                                                                                        className={classes.orderProducts} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        }
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </ThemeProvider>
                                    </CacheProvider>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                </Grid >
            </div>
        </>

    );
};

export default History