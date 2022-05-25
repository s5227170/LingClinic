import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../../store/actions/auth';

import classes from './NavElement.module.css';

interface Props {
    icon: any;
    title: string;
    to: string;
}

const NavItem: FC<Props> = ({ icon: icon, title: title, to: to }) => {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout())
        window.location.reload();
    }

    return (
        <div className={classes.Wrapper} >
            {icon}
            {to == "logout" ?
                <a onClick={logoutHandler}>{title}</a>
                :
                <NavLink className={({isActive}) => isActive ? classes.active : ''} to={to}>{title}</NavLink>
            }
        </div >
    )

}

export default NavItem;