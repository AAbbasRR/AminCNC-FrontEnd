import React, { useState, useEffect } from 'react';

import classes from './styles/Input.module.scss';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const NumberField = ({ label = "", min = 0, max, currentNumber = null, controllerBtn = false, disabled = false, onChange }) => {
    const [value, setValue] = useState(min);
    const [status, setStatus] = useState({
        error: false,
        errorMsg: ""
    });

    useEffect(()=> {
        if (currentNumber && currentNumber !== value){
            setValue(currentNumber);
        };
    }, [currentNumber])
    useEffect(() => {
        if (value > max) {
            setValue(max);

        } else {
            setValueHandler(value);
        };
    }, [min, max]);
    useEffect(() => {
        onChange(value);
    }, [value]);

    const setValueHandler = (number) => {
        setStatus({
            error: false,
            errorMsg: ""
        });
        if (number < min) {
            setValue(min);
        } else if (number > max) {
            setStatus({
                error: true,
                errorMsg: `حداکثر موجودی این کالا ${max} میباشد`
            });
        } else {
            setValue(number);
        };
    };
    const changelHandler = (event) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        setValueHandler(Number(onlyNums));
    };
    const addHandler = () => {
        setValueHandler(value + 1);
    };
    const removeHandler = () => {
        setValueHandler(value - 1);
    };

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    // Create rtl cache
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={rtltheme}>
                <div className={classes.numberInputBox}>
                    {controllerBtn &&
                        <div className={classes.controllerBtn} onClick={addHandler}>
                            <Typography variant="caption" className={classes.controllerTxt}>
                                +
                            </Typography>
                        </div>
                    }
                    <TextField
                        error={status.error}
                        helperText={status.errorMsg}
                        label={label}
                        value={value}
                        id="standard-size-small"
                        variant="standard"
                        onChange={changelHandler}
                        disabled={disabled}
                        className={classes.numberInput}
                    />
                    {controllerBtn &&
                        <div className={classes.controllerBtn} onClick={removeHandler}>
                            <Typography variant="caption" className={classes.controllerTxt}>
                                -
                            </Typography>
                        </div>
                    }
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default NumberField