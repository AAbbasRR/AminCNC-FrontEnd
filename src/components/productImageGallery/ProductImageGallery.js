import React, { useState, useEffect } from 'react';

import classes from './styles/ProductImageGallery.module.scss';

import Grid from '@mui/material/Grid';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const ProductImageGallery = ({ images }) => {
    const [indexImage, setIndexImage] = useState("");
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        if (images.length >= 1) {
            let supportImages = [...images];
            setIndexImage(supportImages[0]);
            supportImages.splice(0, 1);
            setProductImages([...supportImages]);
        };
    }, []);

    const changePicHandler = (event, image, index) => {
        let productImagesNew = [...productImages];
        productImagesNew[index] = indexImage;
        setIndexImage(image);
        setProductImages([...productImagesNew]);
    }

    return (
        <div className={classes.container}>
            <div className={classes.containerBox}>
                <LazyLoadImage src={indexImage.image} className={classes.galleryImages} />
            </div>
            <div className={classes.containerBox}>
                <Grid container direction="row" spacing={1}>
                    {productImages.map((item, index) => (
                        <Grid key={`productImages_${index}`} item xs={3} onClick={(event) => changePicHandler(event, item, index)}>
                            <LazyLoadImage src={item.image} className={classes.galleryImages} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default ProductImageGallery