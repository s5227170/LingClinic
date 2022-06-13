import React, { ChangeEvent, FC, HTMLAttributes, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './FileUploadInput.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileUploadInput: FC<Props> = (props) => {
    const navigate = useNavigate();
    const fileUploadeInput = useRef<HTMLInputElement>(null)

    const fileHandler = () => {
        if (fileUploadeInput.current) {
            fileUploadeInput.current.click()
        }
    }

    return (
        <div {...props} className={classes.Wrapper}>
            <input onChange={props.onChange} ref={fileUploadeInput} type="file" className={classes.FunctionButton} />
            <button onClick={fileHandler} className={classes.StyleButton}>Upload Files</button>
        </div>
    );
}

export default FileUploadInput;