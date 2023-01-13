import React from 'react';

import classes from './styles/Breadcrumb.module.scss';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const Breadcrumb = ({ items }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
            <Link underline="hover" color="inherit" href="/">
                صفحه اصلی
            </Link>
            {items.map((item) => (
                <div>
                    {item.link ?
                        <Link
                            underline="hover"
                            color="inherit"
                            href={item.link}
                        >
                            {item.title}
                        </Link>
                        :
                        <Typography color="inherit">
                            {item.title}
                        </Typography>
                    }
                </div>
            ))}
        </Breadcrumbs>
    );
};

export default Breadcrumb