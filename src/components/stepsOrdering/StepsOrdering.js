import React from 'react';

import classes from './styles/StepsOrdering.module.scss';

import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';


const StepsOrdering = ({ productSteps = false }) => {
    return (
        <>
            {productSteps ?
                <Grid container spacing={4} direction="row" className={classes.stepContainer}>
                    <Hidden smDown>
                        <Grid item sm={1} />
                    </Hidden>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            1
                        </Typography>
                        <div className={`${classes.icon} ${classes.chooseProductIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            انتخاب محصول
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            2
                        </Typography>
                        <div className={`${classes.icon} ${classes.registerIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            ثبت نام در سایت
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            3
                        </Typography>
                        <div className={`${classes.icon} ${classes.submitOrderIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            تکمیل سفارش
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            4
                        </Typography>
                        <div className={`${classes.icon} ${classes.paymentIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            پرداخت نهایی
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            5
                        </Typography>
                        <div className={`${classes.icon} ${classes.deliveryIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            تحویل سفارش
                        </Typography>
                    </Grid>
                    <Hidden smDown>
                        <Grid item sm={1} />
                    </Hidden>
                </Grid>
                :
                <Grid container spacing={4} direction="row" className={classes.stepContainer}>
                    <Hidden smDown>
                        <Grid item sm={1} />
                    </Hidden>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            1
                        </Typography>
                        <div className={`${classes.icon} ${classes.registerIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            ثبت نام در سایت
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            2
                        </Typography>
                        <div className={`${classes.icon} ${classes.sendData}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            ارسال درخواست و طرح
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            3
                        </Typography>
                        <div className={`${classes.icon} ${classes.priceAgreement}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            توافق قیمت
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            4
                        </Typography>
                        <div className={`${classes.icon} ${classes.paymentIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            پرداخت نهایی
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2} className={classes.stepItem}>
                        <Typography variant="caption" className={`subtitle ${classes.counter}`}>
                            5
                        </Typography>
                        <div className={`${classes.icon} ${classes.deliveryIcon}`} />
                        <Typography variant="subtitle2" className={`title ${classes.title}`}>
                            تحویل سفارش
                        </Typography>
                    </Grid>
                    <Hidden smDown>
                        <Grid item sm={1} />
                    </Hidden>
                </Grid>
            }
        </>
    );
};

export default StepsOrdering