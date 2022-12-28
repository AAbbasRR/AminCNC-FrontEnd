import React, { useState } from 'react';

import classes from './styles/AddAddress.module.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import Loading from "../../../components/loader/Loading";

import { UserAddressesCreateAPI, UserAddressesEditAPI } from '../../../api/User';
import CallApi from "../../../functions/CallApi";


const AddAddress = ({ isOpen, closeHandler, items = null, edit = false }) => {
    const reduxUserData = useSelector(state => state.UserReducer);
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [userIsReceiver, setUserIsReceiver] = useState(false);
    const [editableModal, setEditableModal] = useState(false);
    const [addressID, setAddressID] = useState(0);
    const [formData, setFormData] = useState({
        address_description: "",
        post_code: "",
        receiver: "",
        receiver_mobile_number: ""
    });
    const [dataError, setDataError] = useState({
        address_description: {
            error: false,
            message: ""
        },
        post_code: {
            error: false,
            message: ""
        },
        receiver: {
            error: false,
            message: ""
        },
        receiver_mobile_number: {
            error: false,
            message: ""
        },
    });

    if (edit === true && editableModal === false) {
        setAddressID(items.id);
        setFormData({
            address_description: items.address_description,
            post_code: items.post_code,
            receiver: items.receiver,
            receiver_mobile_number: items.receiver_mobile_number
        });
        if (items.receiver_mobile_number === reduxUserData.mobile_number && items.receiver === `${reduxUserData.first_name} ${reduxUserData.last_name}`) {
            setUserIsReceiver(true);
        };
        setEditableModal(true);
    };

    const resetStatesAndClose = (reload) => {
        setIsLoading(false);
        setUserIsReceiver(false);
        setEditableModal(false);
        setAddressID(0);
        setFormData({
            address_description: "",
            post_code: "",
            receiver: "",
            receiver_mobile_number: ""
        });
        setDataError({
            address_description: {
                error: false,
                message: ""
            },
            post_code: {
                error: false,
                message: ""
            },
            receiver: {
                error: false,
                message: ""
            },
            receiver_mobile_number: {
                error: false,
                message: ""
            },
        });
        closeHandler(false, reload);
    };
    const userIsReceiverHandler = (event) => {
        setDataError({
            ...dataError,
            receiver: {
                error: false,
                message: ""
            },
            receiver_mobile_number: {
                error: false,
                message: ""
            },
        });
        if (event.target.checked) {
            setFormData({
                ...formData,
                receiver: `${reduxUserData.first_name} ${reduxUserData.last_name}`,
                receiver_mobile_number: reduxUserData.mobile_number
            });
        } else {
            setFormData({
                ...formData,
                receiver: "",
                receiver_mobile_number: ""
            });
        };
        setUserIsReceiver(event.target.checked);
    };
    const formTextFieldChangeHandler = (event, inputName) => {
        let dataErrorNew = { ...dataError };
        dataErrorNew[inputName] = {
            error: false,
            message: ""
        };
        let newData = { ...formData };
        if (inputName === "receiver_mobile_number") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 11) {
                newData[inputName] = onlyNums;
            };
        } else if (inputName === "post_code") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 10) {
                newData[inputName] = onlyNums;
            };
        } else {
            newData[inputName] = event.target.value;
        };
        setFormData(newData);
        setDataError(dataErrorNew);
    };
    const submitFormHandler = async (event) => {
        event.preventDefault();
        let isFormValid = await formValidation();
        if (isFormValid) {
            sendCommentHandler();
        };
    };
    const formValidation = async () => {
        let schema = yup.object().shape({
            address_description: yup.string({
                field: "address_description",
                message: "آدرس باید شامل متن باشد"
            }).required({
                field: "address_description",
                message: "آدرس نباید خالی باشد"
            }),
            post_code: yup.string({
                field: "post_code",
                message: "کدپستی باید شامل متن باشد"
            }).required({
                field: "post_code",
                message: "کدپستی نباید خالی باشد"
            }),
            receiver: yup.string({
                field: "receiver",
                message: "گیرنده باید شامل متن باشد"
            }).required({
                field: "receiver",
                message: "نام و نام خانوادگی گیرنده نباید خالی باشد"
            }),
            receiver_mobile_number: yup.string({
                field: "receiver_mobile_number",
                message: "شماره موبایل گیرنده باید شامل متن باشد"
            }).test("mobile", {
                field: "receiver_mobile_number",
                message: "شماره تماس گیرنده صحبح نمیباشد"
            }, (mobile_number) => mobile_number.match(/^{?(0?9[0-9]{9,9}}?)$/g)).required({
                field: "address_description",
                message: "شماره تماس گیرنده نباید خالی باشد"
            }),
        });
        try {
            await schema.validate({ ...formData }, { abortEarly: false });
            return true;
        } catch (error) {
            let errorMessage = { ...dataError };
            error.errors.map((item) => {
                errorMessage[item.field].error = true;
                errorMessage[item.field].message = item.message;
                return null;
            });
            setDataError({ ...errorMessage });
            return false;
        };
    };
    const sendCommentHandler = async () => {
        setIsLoading(true);
        try {
            if (edit) {
                await CallApi(UserAddressesEditAPI(addressID, formData.address_description, formData.post_code, formData.receiver, formData.receiver_mobile_number));
                enqueueSnackbar("آدرس شما با موفقیت ویرایش شد", { variant: "success" });
            } else {
                await CallApi(UserAddressesCreateAPI(formData.address_description, formData.post_code, formData.receiver, formData.receiver_mobile_number));
                enqueueSnackbar("آدرس شما با موفقیت ایجاد شد", { variant: "success" });
            };
            resetStatesAndClose(true);
        } catch (error) {
            let response = error?.response?.data?.data;
            let dataErrorNew = { ...dataError };
            Object.keys(response).forEach(key => {
                dataErrorNew[key] = {
                    error: true,
                    message: response[key]
                };
            });
            setDataError(dataErrorNew);
        } finally {
            setIsLoading(false);
        };
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
            {isLoading && <Loading isLoading={true} />}
            <Dialog
                fullScreen={fullScreen}
                open={isOpen}
                onClose={() => resetStatesAndClose(false)}
            >
                <DialogTitle className={`subtitle ${classes.dialogTitle}`} variant="h6">
                    {editableModal ?
                        "ویرایش کردن آدرس"
                        :
                        "اضافه کردن آدرس جدید"
                    }
                </DialogTitle>
                <form autoComplete="off">
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={rtltheme}>
                            <DialogContent className={classes.dialogContent}>
                                <TextField
                                    onChange={(e) => formTextFieldChangeHandler(e, 'address_description')}
                                    value={formData.address_description}
                                    multiline
                                    rows={3}
                                    label="آدرس"
                                    fullWidth
                                    error={dataError.address_description.error}
                                    helperText={dataError.address_description.message}
                                />
                                <TextField
                                    onChange={(e) => formTextFieldChangeHandler(e, 'post_code')}
                                    value={formData.post_code}
                                    label="کدپستی"
                                    fullWidth
                                    error={dataError.post_code.error}
                                    helperText={dataError.post_code.message}
                                />
                                <div className={classes.receiverInputs}>
                                    <TextField
                                        onChange={(e) => formTextFieldChangeHandler(e, 'receiver')}
                                        value={formData.receiver}
                                        label="نام و نام خانوادگی تحویل گیرنده"
                                        fullWidth
                                        error={dataError.receiver.error}
                                        helperText={dataError.receiver.message}
                                        disabled={userIsReceiver}
                                    />
                                    <TextField
                                        onChange={(e) => formTextFieldChangeHandler(e, 'receiver_mobile_number')}
                                        value={formData.receiver_mobile_number}
                                        label="شماره تماس تحویل گیرنده"
                                        fullWidth
                                        error={dataError.receiver_mobile_number.error}
                                        helperText={dataError.receiver_mobile_number.message}
                                        disabled={userIsReceiver}
                                    />
                                </div>
                                <FormGroup className={classes.imReceiverCheckBox}>
                                    <FormControlLabel control={<Checkbox checked={userIsReceiver} onChange={userIsReceiverHandler} />} label="گیرنده خودم هستم" />
                                </FormGroup>
                            </DialogContent>
                        </ThemeProvider>
                    </CacheProvider>
                    <DialogActions className={classes.dialogActions}>
                        <Button disabled={isLoading} className={classes.dialogButton} onClick={() => resetStatesAndClose(false)}>
                            بستن
                        </Button>
                        <Button disabled={isLoading} className={classes.dialogButton} onClick={submitFormHandler}>
                            ثبت
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddAddress