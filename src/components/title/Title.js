import React from 'react';

import classes from './styles/Title.module.scss';

import Typography from '@mui/material/Typography';

const Title = ({ text, size = "md" }) => {
    return (
        <Typography className={`title ${classes.title}`} align="center" variant={size === "lg" ? "h2" : size === "md" ? "h4" : size ==="sm" ? "h6" : "body1"}>
            {text}
        </Typography>
    );
};

export default Title