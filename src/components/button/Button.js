import React from 'react';

import classes from './styles/Button.module.scss';

import { Link } from 'react-router-dom';


const Button = ({ text, link = "#", externalLink = false, topSpacing = false }) => {
    return (
        <>
            <div className={`${classes.button} ${topSpacing && classes.marginTop}`}>
                {externalLink ?
                    <a className={`link ${classes.link}`} href={link}>

                        {text}
                    </a>
                    :
                    <Link className={`link ${classes.link}`} to={link}>
                        {text}
                    </Link>
                }
                <svg className={classes.buttonSVG} width="180" height="50" viewBox="0 0 180 50" xlmns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" fill="none" width="180" height="50" />
                </svg>
            </div>
        </>
    );
};

export default Button