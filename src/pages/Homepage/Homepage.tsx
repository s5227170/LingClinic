import React, { FC, useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { RootState } from '../../store';

import Clinic from '../../static/images/About the clinic.jpg';
import Team from '../../static/images/Meet the team.jpg';
import Kinesitherapy from '../../static/images/Kinesitherapy.jpg';
import PermanentIllnesses from '../../static/images/PermanentIllnessess.jpg';
import PhysiotherapyService from '../../static/images/PhysiotherapyService.jpg';

import classes from './Homepage.module.css';
import "./Homepage.css";
import { setError, setSuccess } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';

const Homepage: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error, successAuth } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (successAuth) {
            setTimeout(() => {
                dispatch(setSuccess(""))
            }, 1000);
        }
    }, [successAuth])

    const bookHandler = () => {
        return navigate("/appointmentTherapist")
    }

    const aboutHandler = (service) => {
        return navigate("/about/" + service)
    }

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setSuccess(""))
            dispatch(setError(""))
        }
    }

    return (
        <div className={classes.Wrapper}>
            {/*  @ts-ignore */}
            {error.length > 0 ?
                <ErrorModal message={error} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            {/*  @ts-ignore */}
            {successAuth.length > 0 ?
                <SuccessModal message={successAuth} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            <div className={classes.Wellcome}>
                <h1>Wellcome to Ling Clinic!</h1>
                <hr></hr>
            </div>
            {/* Carousel */}
            <div className={classes.Carousel}>
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Clinic}
                            alt="Clinic"
                        />
                        <Carousel.Caption>
                            <h3 onClick={aboutHandler}>About the Clinic</h3>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Team}
                            alt="Professionals"
                        />
                        <Carousel.Caption>
                            <h3 onClick={aboutHandler}>Meet the Team</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            {/* Clinic information and book now button */}
            <div>
                <div className={classes.ClinicInfo}>
                    <h2>Ling clinic is a new physiotherapy clinic that is based on overcoming of physical disturbances of the musculoskeletal system caused by various condition, illnesses, injuries, and others. We utilise modern physiotherapy devices and aparatus to deliver the highest quality possible when it comes to providing services. <b onClick={aboutHandler}>Learn more</b></h2>
                    <button onClick={bookHandler}>Book an Appointment</button>
                </div>
            </div>
            {/* Types of services cards */}
            <div className={classes.Cards}>
                <div className={classes.ServiceCard} onClick={() => aboutHandler("1")}>
                    <div className={classes.CardImageWrapper}>
                        <div className={classes.CardImage}>
                            <img src={PhysiotherapyService} alt="card1" />
                        </div>
                    </div>
                    <div className={classes.CardInfo} >
                        <h5>Prevention and Beauty</h5>
                        <p>Even if healthy, regular checks are vital for great health. Prevention is better than treatment. If there are any hidden issues, we will find them.</p>
                        <button >Learn More</button>
                    </div>
                </div>
                <div className={classes.ServiceCard} onClick={() => aboutHandler("2")}>
                    <div className={classes.CardImageWrapper}>
                        <div className={classes.CardImage}>
                            <img src={Kinesitherapy} alt="card2" />
                        </div>
                    </div>
                    <div className={classes.CardInfo} >
                        <h5>Kinesitherapy and Temporary Treatment</h5>
                        <p>There are 1.71 billion people worldwide affected by some soft of a condition related to the musculoskeletal system. We offer a vast range of services for tackling such problems. </p>
                        <button >Learn More</button>
                    </div>
                </div>
                <div className={classes.ServiceCard} onClick={() => aboutHandler("3")}>
                    <div className={classes.CardImageWrapper}>
                        <div className={classes.CardImage}>
                            <img src={PermanentIllnesses} alt="card3" />
                        </div>
                    </div>
                    <div className={classes.CardInfo} >
                        <h5>Treatment around disorders</h5>
                        <p>Permanent disorders require prolonged attention and treatments. The clinic has multiple professionals with long experience of specialising in this field.</p>
                        <button >Learn More</button>
                    </div>
                </div>
            </div>
            {/* Contact Information */}
            <div className={classes.ContactWrapper}>
                <div className={classes.Contact}>
                    <h2>Contacts</h2>
                    <div className={classes.ContactOption}>
                        <label>Mobile:</label>
                        <label>07777 777777</label>
                    </div>
                    <div className={classes.ContactOption}>
                        <label>Email:</label>
                        <label>LingClinic@gmail.com</label>
                    </div>
                    <div className={classes.ContactOption}>
                        <label>Facebook:</label>
                        <label>Ling Clinic Original</label>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Homepage;