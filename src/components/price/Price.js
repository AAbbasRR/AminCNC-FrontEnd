import React from 'react';

import classes from './styles/Price.module.scss';

import Typography from '@mui/material/Typography';


const Price = ({ price, discounted = false, size = "sm", className }) => {
    return (
        <Typography variant="caption" className={`caption ${classes.price} ${className} ${discounted && classes.priceDiscount} ${size === "lg" ? classes.lgSize : size === "md" ? classes.mdSize : ""}`}>
            {price.toLocaleString()} تومان
        </Typography>
    );
};

export default Price