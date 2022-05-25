
import React, { FC } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import Logo from '../../../static/images/Logo.png'

import classes from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

const Footer: FC = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.Wrapper}>
            <div className={classes.Links}>
                <div className={classes.LinksContent}>
                    <h3>Links</h3>
                    <hr></hr>
                    <ul>
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>About the Clinic</li>
                        <li>Services and Prices</li>
                    </ul>
                </div>
            </div>
            <div className={classes.LogoSection}>
                <div className={classes.LogoWrapper}>
                    <img onClick={() => navigate("/")} className={classes.Logo} src={Logo} alt="logo-footer" />
                </div>
            </div>
            <div className={classes.SocialMedia}>
                {['top'].map((placement) => (
                    <OverlayTrigger
                        key={placement}
                        placement={"top"}
                        overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                                <strong>Contacts</strong>
                            </Tooltip>
                        }
                    >
                        <i id="envelope" className="fa-solid fa-envelope fa-3x"></i>
                    </OverlayTrigger>
                ))}
                {['top'].map((placement) => (
                    <OverlayTrigger
                        key={placement}
                        placement={"top"}
                        overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                                <strong>Instagram</strong>
                            </Tooltip>
                        }
                    >
                        <i id="instagram" className="fa-brands fa-instagram-square fa-3x"></i>
                    </OverlayTrigger>
                ))}
                {['top'].map((placement) => (
                    <OverlayTrigger
                        key={placement}
                        placement={"top"}
                        overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                                <strong>Youtube</strong>
                            </Tooltip>
                        }
                    >
                        <i id="youtube" className="fa-brands fa-youtube-square fa-3x"></i>
                    </OverlayTrigger>
                ))}
                {['top'].map((placement) => (
                    <OverlayTrigger
                        key={placement}
                        placement={"top"}
                        overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                                <strong>Facebook</strong>
                            </Tooltip>
                        }
                    >
                        <i id="facebook" className="fa-brands fa-facebook-square fa-3x"></i>
                    </OverlayTrigger>
                ))}
            </div>
        </div >
    )

}

export default Footer;