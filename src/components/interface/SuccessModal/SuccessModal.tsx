import React, { FC, HTMLAttributes } from 'react';

import classes from './SuccessModal.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
    message: string;
    backdropOnClick?: (e: any) => void;
    width: string;
    height: string;
}

const SuccessModal: FC<Props> = (props) => {

    return (
        <div className={classes.Wrapper}>
            <div className={classes.Backdrop} onClick={props.backdropOnClick}>
            </div>
            <div className={classes.Modal} style={{ "width": props.width, "height": props.height }}>
                <div className={classes.SuccessModalHeader}>
                    <h4 className='success'>Success</h4>
                    <i className="fa-regular fa-circle-xmark" onClick={props.backdropOnClick}></i>
                </div>
                <div className={classes.SuccessModalContent}>
                    <h4>{props.message}</h4>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;