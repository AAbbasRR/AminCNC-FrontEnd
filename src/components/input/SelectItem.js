import React, { useState } from 'react';

import classes from './styles/Input.module.scss';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SelectItem = ({ label = "", items, selected_value = null, onChange, size = "medium", fullWidth = false, variant = "standard", error=false }) => {
    const [value, setValue] = useState("");

    const changelHandler = (event) => {
        setValue(event.target.value);
        onChange(event);
    };

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={rtltheme}>
                <FormControl fullWidth={fullWidth} variant={variant} className={fullWidth || classes.selectControl} size={size} required error={error}>
                    <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={selected_value ? selected_value : value}
                        label={label}
                        onChange={changelHandler}
                    >
                        {items.map((item, index) => (
                            <MenuItem key={`selectitem_${index}`} disabled={item?.disabled && true} value={item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default SelectItem