import React from 'react';

import classes from './styles/Footer.module.scss';

import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

import Newsletter from '../newsletter/Newsletter';


const Footer = () => {
    const pages = [{
        title: "صفحه اصلی",
        link: "/",
        externalLink: false
    }, {
        title: "محصولات",
        link: "/products",
        externalLink: false
    }, {
        title: "محصول سفارشی",
        link: "/optinal_product",
        externalLink: false
    }, {
        title: "تماس با ما",
        link: "#contactus",
        externalLink: true
    }];
    return (
        <>
            <footer id={classes.footer}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#424750" d="M0,288L80,250.7C160,213,320,139,480,133.3C640,128,800,192,960,192C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
                <Grid container direction="row" className={classes.container}>
                    <Hidden mdDown>
                        <Grid item md={1} />
                    </Hidden>
                    <Grid item xs={12} sm={6} md={4} className={classes.footerItemBox}>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} className={classes.footerItemBox}>
                        <Typography variant="subtitle1" className={`subtitle ${classes.title}`}>
                            راهنمای منو
                        </Typography>
                        {pages.map((page, index) => (
                            <>
                                {page.externalLink ?
                                    <a key={`footer_${index}`} className={`link ${classes.menuItem}`} href={page.link}>
                                        {page.title}
                                    </a>
                                    :
                                    <Link key={`footer_${index}`} className={`link ${classes.menuItem}`} to={page.link}>
                                        {page.title}
                                    </Link>
                                }
                            </>
                        ))}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} className={classes.footerItemBox}>
                        <Newsletter />
                    </Grid>
                    <Hidden mdDown>
                        <Grid item md={1} />
                    </Hidden>
                </Grid>
            </footer>
            <div className={classes.copyright}>
                <Typography variant="caption" className={`caption ${classes.copyrightText}`}>
                    کلیه حقوق این سایت متعلق به شرکت امین cnc میباشد.
                </Typography>
                <Typography variant="caption" className={`caption ${classes.copyrightText} ${classes.copyrightTextEnglish}`}>
                    ©2022-2023 AminCNC. All Rights Reserved.
                </Typography>
            </div>
        </>
    );
};

export default Footer