import React from 'react';

import classes from './styles/Product.module.scss';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';

import { useNavigate } from 'react-router-dom';

import Price from '../price/Price';

const Product = ({ title, link, description, image, price, category = null }) => {
    const history = useNavigate();

    const pushToSingleProduct = () => {
        history(`/singleProduct/${link}${category ? '?category=' + category : ""}`);
    };

    return (
        <>
            <Hidden smUp>
                <Grid item xs={1} />
            </Hidden>
            <Grid item xs={10} sm={6} md={4} xl={3}>
                <div className={classes.productBox}>
                    <div className={classes.cover} style={{ backgroundImage: `url(${image})` }} onClick={pushToSingleProduct}>
                        <div className={classes.description}>
                            <Typography className={`caption ${classes.descriptionText}`} align="center" variant="subtitle2">
                                {description}
                            </Typography>
                            <Typography className={`caption ${classes.descriptionText}`} align="center" variant="subtitle2">
                                شروع قیمت از <Price className={classes.productPrice} price={price} />
                            </Typography>
                        </div>
                    </div>
                    <Typography className={`subtitle ${classes.title}`} align="center" variant="subtitle2" onClick={pushToSingleProduct}>
                        {title}
                    </Typography>
                </div>
            </Grid>
            <Hidden smUp>
                <Grid item xs={1} />
            </Hidden>
        </>
    );
};

export default Product