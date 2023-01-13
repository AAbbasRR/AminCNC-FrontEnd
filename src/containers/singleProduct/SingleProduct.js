import React, { useState, useEffect } from 'react';

import classes from './styles/SingleProduct.module.scss';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import PageLoader from '../../components/loader/PageLoader';
import Navbar from '../../components/navbar/Navbar';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import ProductImageGallery from '../../components/productImageGallery/ProductImageGallery';
import NumberField from '../../components/input/NumberField';
import SelectItem from '../../components/input/SelectItem';
import Price from '../../components/price/Price';
import Title from '../../components/title/Title';
import StepsOrdering from '../../components/stepsOrdering/StepsOrdering';
import ToUp from '../../components/toUp/ToUp';
import Footer from '../../components/footer/Footer';

import { addProductToCartAction, removeProductFromCartAction } from '../../redux/actions/CartProductActions';

import { GetSingleProductAPI } from "../../api/Products";
import CallApi from "../../functions/CallApi";


const SingleProduct = () => {
    let { slug } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [querySearchParams, setQuerySearchParams] = useSearchParams();
    const history = useNavigate();
    const reduxDispatch = useDispatch();
    const reduxUserData = useSelector(state => state.UserReducer);
    const reduxCartData = useSelector(state => state.CartProductReducer);
    const reduxCategoriesData = useSelector(state => state.CategoriesReducer);

    const [isLoading, setIsLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [materialSelected, setMaterialSelected] = useState(null);
    const [reverceDiscount, setReverceDiscount] = useState(null);
    const [productInCart, setProductInCart] = useState(false);
    const [categoryItem, setCategoryItem] = useState(null);
    const [order, setOrder] = useState({
        number: 1,
        price: "",
        discountStatus: false,
        discountPrice: null,
        preparationTime: 0,
        discountSelected: {
            percent: 0,
            number: 0
        }
    });

    useEffect(() => {
        getProductData();
        getCategoryItemData();
    }, []);
    useEffect(() => {
        calculateDiscountProduct();
    }, [order.number, materialSelected]);
    useEffect(() => {
        checkProductHasInCart();
    }, [materialSelected]);

    const getProductData = async () => {
        setIsLoading(true);
        try {
            let result = await CallApi(GetSingleProductAPI(slug));
            setProductData(result);
            if (result?.materials) {
                let materialsVar = [];
                let size;
                result.materials.map((item) => {
                    size = `${item.size.width}x${item.size.length}${item.size.height ? 'x' + item.size.height : ''}`;
                    materialsVar.push({
                        label: `${item.material.ingredient} - ${item.material.color} - ${size}`,
                        value: item.id,
                        number: item.number,
                        price: Number(item.price)
                    });
                });
                setMaterials(materialsVar);
                let query_editMaterialId = querySearchParams.get("editMaterialId");
                if (query_editMaterialId) {
                    setMaterialSelected(materialsVar.find(item => item.value === Number(query_editMaterialId)));
                };
            };
            if (result?.discounts) {
                let reverseDiscounts = [...result.discounts];
                setReverceDiscount(reverseDiscounts.reverse());
            };
        } catch (error) {
            history('/products');
        } finally {
            setIsLoading(false);
        };
    };
    const getCategoryItemData = () => {
        let categoryParam = querySearchParams.get("category");
        if (categoryParam) {
            let findReduxCategory = reduxCategoriesData.find(category => category.slug === categoryParam);
            if (findReduxCategory) {
                setCategoryItem(findReduxCategory);
            };
        };
    };
    const materialChangeHandler = (event) => {
        let materialsNew = [...materials];
        let foundMaterial = materialsNew.find(element => element.value === event.target.value);
        setMaterialSelected(foundMaterial);
    };
    const numberChangeHandler = (value) => {
        setOrder({ ...order, number: value });
    };
    const checkProductHasInCart = () => {
        if (materialSelected) {
            if (productData && reduxCartData) {
                let cartProduct = reduxCartData.find(item => item.product_id === productData.productId && item.material_id === materialSelected.value);
                if (cartProduct) {
                    setOrder({
                        ...order,
                        number: cartProduct.number
                    });
                    setProductInCart(true);
                } else {
                    if (productInCart) {
                        setProductInCart(false);
                    };
                };
            };
        };
    };
    const calculateDiscountProduct = () => {
        let preparation = 0;
        if (productData && productData.preparation_time) {
            preparation = Math.ceil((order.number / productData.preparation_time.number) * productData.preparation_time.preparation_time, 0);
        };
        if (reverceDiscount) {
            let priceSeted = true;
            for (let i = 0; i < reverceDiscount.length; i++) {
                if (reverceDiscount[i].number <= order.number) {
                    let priceProduct = order.number * materialSelected.price;
                    setOrder({
                        ...order,
                        price: priceProduct - (priceProduct * (reverceDiscount[i].percent / 100)),
                        discountStatus: true,
                        discountPrice: priceProduct,
                        preparationTime: preparation,
                        discountSelected: {
                            percent: reverceDiscount[i].percent,
                            number: reverceDiscount[i].number
                        }
                    });
                    priceSeted = false;
                    break;
                };
            };
            if (priceSeted) setOrder({
                ...order,
                price: materialSelected ? order.number * materialSelected.price : "",
                discountStatus: false,
                discountPrice: null,
                preparationTime: preparation,
                discountSelected: {
                    percent: 0,
                    number: 0
                }
            });
        };
    };
    const addToCartHandler = () => {
        if (materialSelected) {
            if (reduxUserData.token) {
                reduxDispatch(addProductToCartAction(productData, materialSelected, order));
                enqueueSnackbar("محصول شما به سبد خرید اضافه شد", { variant: "success" });
                setProductInCart(true);
            } else {
                enqueueSnackbar("برای اضافه کردن محصول لطفا وارد حساب کاربری خود شوید", { variant: "error" });
                history('/auth/login');
            };
        } else {
            enqueueSnackbar("اول (نوع - سایز - رنگ) محصول مورد نظر را انتخاب کنید", { variant: "error" });
        };
    };
    const deleteProductHandler = () => {
        reduxDispatch(removeProductFromCartAction(productData.productId, materialSelected.value));
        setOrder({
            number: 1,
            price: "",
            discountStatus: false,
            discountPrice: null,
            preparationTime: 0,
            discountSelected: {
                percent: 0,
                number: 0
            }
        });
        setProductInCart(false);
    };

    return (
        <>
            {isLoading && <PageLoader isLoading={true} />}
            <Navbar />
            <div className={classes.main}>
                <Grid container direction="column">
                    <Grid item className={classes.container}>
                        {productData &&
                            <Container maxWidth="lg">
                                {categoryItem ?
                                    <Breadcrumb items={[
                                        { title: "محصولات", link: "/products" },
                                        { title: categoryItem.name, link: `/products?category=${categoryItem.slug}` },
                                        { title: productData.name, },
                                    ]} />
                                    :
                                    <Breadcrumb items={[
                                        { title: "محصولات", link: "/products" },
                                        { title: productData.name, },
                                    ]} />
                                }
                                <Grid container direction="row" spacing={2} className={classes.component}>
                                    <Grid item xs={12} sm={4}>
                                        <ProductImageGallery
                                            images={productData.images}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <div className={classes.productDetailBox}>
                                            <Typography variant="h6" className={`title ${classes.title}`}>
                                                {productData.name}
                                            </Typography>
                                            <Typography variant="subtitle2" className={`caption`}>
                                                {productData.short_description}
                                            </Typography>
                                            <SelectItem
                                                label="نوع - رنگ - سایز"
                                                items={materials}
                                                onChange={materialChangeHandler}
                                                selected_value={materialSelected && materialSelected.value}
                                            />
                                            <div className={classes.productCountPrice}>
                                                <NumberField
                                                    label="تعداد"
                                                    min={1}
                                                    max={materialSelected ? materialSelected.number : 1}
                                                    currentNumber={order.number}
                                                    controllerBtn={materialSelected ? true : false}
                                                    disabled={materialSelected ? false : true}
                                                    onChange={numberChangeHandler}
                                                />
                                                {order.price &&
                                                    <div className={classes.productPrice}>
                                                        {order.discountStatus &&
                                                            <Price price={order.discountPrice} discounted size="md" />
                                                        }
                                                        <Price price={order.price} size="md" />
                                                    </div>
                                                }
                                                {order.preparationTime !== 0 &&
                                                    <div className={classes.productPrice}>
                                                        <Typography variant="caption" className={`caption`}>
                                                            زمان آماده سازی:
                                                        </Typography>
                                                        <Typography variant="caption" className={`caption`}>
                                                            {`${order.preparationTime} روزکاری`}
                                                        </Typography>
                                                    </div>
                                                }
                                            </div>
                                            <div className={classes.productActions}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={addToCartHandler}
                                                >
                                                    {productInCart ? "ویرایش کردن از سبد خرید " : "اضافه کردن به سبد خرید"}
                                                </Button>
                                                {productInCart &&
                                                    <Tooltip title="حذف از سبد خرید">
                                                        <IconButton onClick={deleteProductHandler} aria-label="remove product">
                                                            <DeleteSweepIcon
                                                                sx={{
                                                                    fontSize: 30,
                                                                }}
                                                                className={classes.RemoveIconAction} />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            </div>
                                            {productData.discounts &&
                                                <div className={classes.discountBox}>
                                                    <Typography variant="subtitle1" className={`subtitletitle ${classes.subcolor}`}>
                                                        تخفیف های زیر بطور اتوماتیک با افزودن به سبد خرید محاسبه می شوند:
                                                    </Typography>
                                                    {productData.discounts.map((item, index) => (
                                                        <Typography key={`singleProductDiscount_${index}`} variant="caption" className={`caption ${classes.subcolor} ${(item.number === order.discountSelected.number && item.percent === order.discountSelected.percent) && classes.selectedDiscount}`}>
                                                            بیشتر از {item.number} عدد = {item.percent} درصد تخفیف
                                                        </Typography>
                                                    ))}
                                                </div>
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container direction="column" className={classes.component}>
                                    <Title text="توضیحات تکمیلی" />
                                    <Typography align="justify" className={classes.content}>
                                        {productData.description ? productData.description : "خالی"}
                                    </Typography>
                                </Grid>
                                <Grid container direction="column" className={classes.component}>
                                    <Title text="مراحل ثبت سفارش" size="sm" />
                                    <StepsOrdering productSteps />
                                </Grid>
                            </Container>
                        }
                    </Grid>
                </Grid>
                <ToUp />
            </div >
            <Footer />
        </>
    );
};

export default SingleProduct