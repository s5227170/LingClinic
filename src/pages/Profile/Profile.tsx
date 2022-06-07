import React, { FC, useEffect, Fragment, useState } from 'react';

import classes from './Profile.module.css';
import avatar from '../../static/images/unknown.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import HealthcareAndAppointmentList from '../../components/interface/HealthcareAndAppointmentList/HealthcareAndAppointmentList';
import { useNavigate } from 'react-router-dom';
import { getexistingprocedures, setAppointmentError, setAppointmentSuccess } from '../../store/actions/appointments';
import { v4 as uuid } from "uuid";
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import { css } from "@emotion/react";
import { PuffLoader } from 'react-spinners';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import IconWithTooltip from '../../components/interface/IconWithTooltip/IconWithTooltip';

const Profile: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, authenticated, authToken } = useSelector((state: RootState) => state.auth);
    const { existingProcedures, success, error, loading } = useSelector((state: RootState) => state.appointments);

    const [dataList, setDataList] = useState(false);
    const loader = css`
    margin: 5rem auto 1rem auto;
    `
    useEffect(() => {
        dispatch(getexistingprocedures(authToken))
    }, [])

    useEffect(() => {
        if (existingProcedures)
            setDataList(true)
    }, [existingProcedures])

    useEffect(() => {
        if (success == "success" || success == "success_cancel") {
            setDataList(false)
            getexistingprocedures(authToken)
        }
        return () => {
            setAppointmentSuccess("")
        }
    }, [success])


    const bookHandler = () => {
        if (authenticated) {
            console.log("relocate to booking");
            return navigate("/appointmentTherapist")
        }
        console.log("relocate to authenticate");
        return navigate("/authenticate")
    }


    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setAppointmentError(""))
            dispatch(setAppointmentSuccess(""))
        }
    }

    return (
        <div className={classes.Wrapper}>
            <BackgroundEffect />
            {/*  @ts-ignore */}
            {error.length > 0 ?
                <ErrorModal message={error} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            {/*  @ts-ignore */}
            {success.length > 0 ?
                <SuccessModal message={success} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            <div className={classes.Profile}>
                <div className={classes.Header}>
                    <div className={classes.ListHeader}>
                        <h3>Healthcares and Appointments</h3>
                    </div>
                    <div className={classes.OptionsHeader}>
                        {/* add buttons here */}
                        <IconWithTooltip position={"top"} clickHandler={bookHandler} tooltip={"Book an appointment"}>
                            <i onClick={bookHandler} id="bookAppointment" className="fa-regular fa-hospital"></i>
                        </IconWithTooltip>
                    </div>
                </div>
                <div className={classes.Content}>
                    <div className={classes.HealthcareList}>
                        {/* List healthcares here */}
                        {dataList ?
                            <HealthcareAndAppointmentList key={uuid()} data={existingProcedures} itemsPerPage={5} startFrom={1} />
                            :
                            <div className={classes.Loading}>
                                <PuffLoader css={loader} color={"#fff"} loading={loading} size={300} />
                                <h4 className={classes.SpinnerText}>Loading...</h4>
                            </div>}
                    </div>
                    <div className={classes.Divider}>
                    </div>
                    <div className={classes.UserInfo}>
                        <div className={classes.AvatarWrapper}>
                            <img src={avatar} />
                        </div>
                        <div className={classes.Details}>
                            <hr></hr>
                            <div className={classes.InfoField}>
                                <label>Email:</label>
                                {/* @ts-ignore */}
                                <p>{user.email}</p>
                            </div>
                            <hr></hr>
                            <div className={classes.InfoField}>
                                <label>Name:</label>
                                {/* @ts-ignore */}
                                <p>{user.forename + " " + user.surname}</p>
                            </div>
                            <hr></hr>
                            <div className={classes.InfoField}>
                                <label>User:</label>
                                {/* @ts-ignore */}
                                <p>{user.type}</p>
                            </div>
                            <hr></hr>
                            <div className={classes.Legend}>
                                <label>Legend:</label>
                                <div className={classes.Item}>
                                    <div className={classes.ItemPending}>

                                    </div>
                                    <label>Pending</label>
                                </div>
                                <div className={classes.Item}>
                                    <div className={classes.ItemSet}>

                                    </div>
                                    <label>Set</label>
                                </div>
                                <div className={classes.Item}>
                                    <div className={classes.ItemExpired}>

                                    </div>
                                    <label>Expired</label>
                                </div>
                                <div className={classes.Item}>
                                    <div className={classes.ItemDeclined}>

                                    </div>
                                    <label>Declined</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;