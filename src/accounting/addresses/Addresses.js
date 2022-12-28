import React, { useState, useEffect } from 'react';

import classes from './styles/Addresses.module.scss';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import PageLoader from '../../components/loader/PageLoader';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import AddAddress from '../components/addAddress/AddAddress';

import { UserAddressesListAPI, UserAddressesDeleteAPI } from "../../api/User";
import CallApi from "../../functions/CallApi";

const Addresses = () => {
    const history = useNavigate();
    const reduxUserData = useSelector(state => state.UserReducer);
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [disableAddAddress, setDisableAddAddress] = useState(false);
    const [showModalAddAddress, setShowModalAddAddress] = useState(false);
    const [addressDataForEdit, setAddressDataForEdit] = useState(false);
    const [userAddressesData, setUserAddressesData] = useState([]);

    useEffect(() => {
        if (!reduxUserData.first_name || !reduxUserData.last_name) {
            enqueueSnackbar("لطفا اول حساب کاربری خود را تکمیل کنید", { variant: "error" });
            history("/dashboard");
        } else {
            getAddressesData();
        };
    }, []);


    const showModalAddAddressHandler = (status, reload) => {
        setShowModalAddAddress(status);
        setAddressDataForEdit(false);
        if (reload) {
            getAddressesData();
        };
    };
    const getAddressesData = async () => {
        setIsLoading(true);
        try {
            let response = await CallApi(UserAddressesListAPI());
            setDisableAddAddress(response?.disable_add_address_permission);
            setUserAddressesData(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const deleteAddressHandler = async (id) => {
        setIsLoading(true);
        try {
            await CallApi(UserAddressesDeleteAPI(id));
            getAddressesData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };
    const editShowModalAddressHandler = (item) => {
        setAddressDataForEdit(item);
        setShowModalAddAddress(true);
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
            <AddAddress isOpen={showModalAddAddress} closeHandler={showModalAddAddressHandler} items={addressDataForEdit} edit={addressDataForEdit ? true : false} />
            <div className={classes.main}>
                <Sidebar />
                <Navbar />
                <Grid container direction="row" spacing={3} className={classes.container}>
                    <Grid item xs={12} sm={12}>
                        <Paper elevation={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" align="right" className={`subtitle ${classes.cardHeader}`}>
                                        آدرس های ثبت شده
                                    </Typography>
                                    <Divider />
                                    <CacheProvider value={cacheRtl}>
                                        <ThemeProvider theme={rtltheme}>
                                            <TableContainer className={classes.table}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={`subtitle`}>
                                                                آدرس
                                                            </TableCell>
                                                            <TableCell className={`subtitle`}>
                                                                کد پستی
                                                            </TableCell>
                                                            <TableCell className={`subtitle`}>
                                                                گیرنده
                                                            </TableCell>
                                                            <TableCell className={`subtitle`}>
                                                                شماره تماس
                                                            </TableCell>
                                                            <TableCell className={`subtitle`}>
                                                                &nbsp;
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {userAddressesData.map((item, index) => (
                                                            <TableRow key={`userAddress_${index}`}>
                                                                <TableCell className={`caption`}>
                                                                    {item.address_description}
                                                                </TableCell>
                                                                <TableCell className={`caption`}>
                                                                    {item.post_code}
                                                                </TableCell>
                                                                <TableCell className={`caption`}>
                                                                    {item.receiver}
                                                                </TableCell>
                                                                <TableCell className={`caption`}>
                                                                    {item.receiver_mobile_number}
                                                                </TableCell>
                                                                <TableCell className={`caption`}>
                                                                    <Stack direction="row" spacing={2}>
                                                                        <Tooltip title="ویرایش آدرس">
                                                                            <IconButton onClick={() => editShowModalAddressHandler(item)} aria-label="edit address">
                                                                                <EditLocationAltIcon
                                                                                    sx={{
                                                                                        fontSize: 29,
                                                                                    }}
                                                                                    className={classes.EditIconAction} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="حذف آدرس">
                                                                            <IconButton onClick={() => deleteAddressHandler(item.id)} aria-label="remove address">
                                                                                <WrongLocationIcon
                                                                                    sx={{
                                                                                        fontSize: 29,
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
                                    <Divider />
                                    {disableAddAddress ||
                                        <Button className={`caption ${classes.addAddress}`} color="info" onClick={() => showModalAddAddressHandler(true, false)}>
                                            <AddLocationAltIcon />&nbsp;اضافه کردن آدرس جدید
                                        </Button>
                                    }
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                </Grid >
            </div >
        </>
    );
};

export default Addresses