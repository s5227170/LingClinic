import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../../../static/images/Logo.png';

import classes from './Header.module.css';

const Header: FC = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.Wrapper}>
            <div className={classes.LogoHeading}>
                <div className={classes.LogoWrapper}>
                    <img onClick={() => navigate("/")} className={classes.Logo} src={Logo} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default Header;