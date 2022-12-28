import React from 'react';

import classes from './styles/ProductHistory.module.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Price from '../../../components/price/Price';


const ProductHistory = ({ isOpen, closeHandler, data }) => {
    const history = useNavigate();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const rtltheme = createTheme({
        direction: 'rtl',
    });
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
                open={isOpen}
                onClose={closeHandler}
            >
                <DialogTitle className={`subtitle ${classes.dialogTitle}`} variant="h6">
                    لیست محصولات
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={rtltheme}>
                            <TableContainer className={classes.table}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={`subtitle`}>
                                                محصول
                                            </TableCell>
                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                تعداد
                                            </TableCell>
                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                قیمت کل
                                            </TableCell>
                                            <TableCell className={`subtitle ${classes.tableCell}`}>
                                                قیمت قابل پرداخت با احتساب تخفیف
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((item, index) => (
                                            <TableRow key={`productHistoryItem_${index}`}>
                                                <TableCell>
                                                    <div className={classes.productCell}>
                                                        <LazyLoadImage className={classes.productImage} src={item.product.product.image} alt={item.product.product.slug} />
                                                        <div className={classes.productNamesCell}>
                                                            <Typography onClick={()=> history(`/singleProduct/${item.product.product.slug}`)} variant="subtitle2" className={`subtitle ${classes.link}`}>
                                                                {item.product.product.name}
                                                            </Typography>
                                                            <Typography variant="subtitle2" className={`subtitle`}>
                                                                {item.product.material}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                    {item.number}
                                                </TableCell>
                                                <TableCell className={`caption ${classes.tableCell}`}>
                                                    <Price className={classes.centerText} price={Number(item.payable_price)} size="md" />
                                                </TableCell>
                                                <TableCell className={`${classes.tableCell}`}>
                                                    <Price className={classes.centerText} price={Number(item.total_price)} size="md" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                    </CacheProvider>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button className={classes.dialogButton} onClick={closeHandler}>
                        بستن
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductHistory