import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import RingLoader from 'react-spinners/RingLoader';


const PageLoader = ({ isLoading }) => {

    return (
        <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <RingLoader
                color="#56459d"
                height={100}
                width={100}
            />
        </Backdrop>
    );
};

export default PageLoader;