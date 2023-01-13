import React from 'react';

import classes from './styles/Page404.module.scss';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import Button from '../../components/button/Button';

import page404 from '../../assets/svg/page_404.svg';


const Page404 = () => (
    <Box component="main" className={classes.main}>
      <Container maxWidth="md">
        <Box className={classes.box}>
          <Typography align="center" color="textPrimary" variant="h3">
            ۴۰۴: صفحه مورد نظر شما پیدا نشد
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <LazyLoadImage alt="page 404 image" src={page404} className={classes.page404Image} />
          </Box>
          <Button text="صفحه اصلی" link='/' />
        </Box>
      </Container>
    </Box>
);

export default Page404;
