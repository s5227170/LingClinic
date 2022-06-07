import React, { FC, HTMLAttributes } from 'react';

import classes from './Modal.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    backdropOnClick?: (e: any) => void;
    width: string | number;
    height: string | number
}

const Modal: FC<Props> = (props) => {

    return (
        <div className={classes.Wrapper}>
            <div className={classes.Backdrop} onClick={props.backdropOnClick}>
            </div>
            <div className={classes.Modal} style={{ "width": props.width, "height": props.height }}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;