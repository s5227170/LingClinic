import React, { FC, InputHTMLAttributes } from 'react';

import classes from './FormInput.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FormInput: FC<Props> = ({type, placeholder, value, onChange, label}) => {


    return (
        <div className={classes.Wrapper}>
            <input className={classes.Input} autoComplete="off" type={type} placeholder={placeholder} value={value} onChange={onChange} />
            <label >{label}</label>
        </div>
    );
}

export default FormInput;