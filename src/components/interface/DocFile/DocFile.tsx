import React, { FC, useState } from 'react';

import classes from './DocFile.module.css';
import "./DocFile.css";
import { useDispatch } from 'react-redux';


interface Props {
    name: string;
    information: string;
    link: string
}

const DocFile: FC<Props> = ({ name, information, link }) => {
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState(false)

    const expandHandler = () => {
        setExpanded(!expanded)
    }

    return (
        <div className={classes.Wrapper}>
            <div className={classes.Doc}>
                <div className={classes.NameAndIcon}>
                    <div className={classes.Name}>
                        <i className="fa-regular fa-file-lines" ></i>
                        <label>{name}</label>
                    </div>
                    {!expanded ?
                        <i id="expander" className="fa-regular fa-circle-down" onClick={expandHandler}></i>
                        :
                        <i id="expander" className="fa-regular fa-circle-up" onClick={expandHandler}></i>
                    }
                </div>

                {expanded ?
                    <div className={classes.Information}>
                        <p>{information}</p>
                        <a href={link? link : "#"} target="_blank"><u>Download</u></a>
                    </div>
                    :
                    null}
            </div>
        </div>
    );
}

export default DocFile;