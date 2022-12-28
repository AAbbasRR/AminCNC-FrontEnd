import React, { useState } from 'react';

import classes from './styles/Navbar.module.scss';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const userData = useSelector(state => state.UserReducer);
    const cartData = useSelector(state => state.CartProductReducer);

    const [anchorElNav, setAnchorElNav] = useState(false);

    const handleOpenNavMenu = () => {
        setAnchorElNav(true);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(false);
    };

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
            <div className={classes.spaceHeader} />
            <AppBar position="sticky" className={classes.navbarHeader}>
                <Toolbar className={classes.toolBarNavbar}>
                    <Drawer
                        anchor='right'
                        open={anchorElNav}
                        onClose={handleCloseNavMenu}
                    >
                        <Box
                            sx={{ width: 200 }}
                            role="presentation"
                            onKeyDown={handleCloseNavMenu}
                        >
                            <List>
                                <ListItem className={classes.listItemResponsive} disablePadding>
                                    <ListItemButton>
                                        <CloseIcon className={classes.drawerIcon} onClick={handleCloseNavMenu} />
                                    </ListItemButton>
                                </ListItem>
                                {pages.map((page, index) => (
                                    <ListItem key={index} disablePadding className={classes.listItemResponsive}>
                                        <ListItemButton>
                                            <ListItemText>
                                                <Link className={`link ${classes.menuItem}`} to={page.link}>{page.title}</Link>
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                    <IconButton
                        size="large"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        className={classes.humbergerMenuIcon}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box className={classes.menuItemsBox} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page, index) => (
                            <>
                                {page.externalLink ?
                                    <a key={`navbar_${index}`} className={`link ${classes.menuItem}`} href={page.link}>
                                        {page.title}
                                    </a>
                                    :
                                    <Link key={`navbar_${index}`} className={`link ${classes.menuItem}`} to={page.link}>
                                        {page.title}
                                    </Link>
                                }
                            </>
                        ))}
                    </Box>
                    <div className={classes.menuToolBox}>
                        {userData.token ?
                            <>
                                <Link className={`link ${classes.menuToolItem} ${classes.menuItem}`} to='/dashboard/cart'>
                                    <ShoppingBasketIcon fontSize="small" className={classes.menuIcon} />
                                    <Badge className={classes.badgeBox} color="primary" badgeContent={cartData.length} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                                        سبد خرید
                                    </Badge>
                                </Link>
                                <Link className={`link ${classes.menuToolItem} ${classes.menuItem}`} to='/dashboard'>
                                    <AccountCircle fontSize="small" className={classes.menuIcon} />
                                    داشبورد
                                </Link>
                            </>
                            :
                            <Link className={`link ${classes.menuToolItem} ${classes.menuItem}`} to='/auth/register' >
                                <HowToRegIcon fontSize="small" className={classes.menuIcon} />
                                ورود/ثبت نام
                            </Link>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Navbar