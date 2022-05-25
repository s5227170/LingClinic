import React, { FC, useState } from 'react';

import classes from './AppointmentItem.module.css';
import './AppointmentItem.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { acceptappointment, cancelappointment, declineappointment } from '../../../store/actions/appointments';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import dateInPast from '../../../util/dateInPast';

interface Props {
    _id: string;
    therapist: string;
    client: string;
    information: string;
    startTime: Date;
    endTime: Date;
    mode: "Therapist" | "Client";
    statusMode: "Set" | "Pending";
    complete: boolean,
}

const AppointmentItem: FC<Props> = ({ _id, therapist, client, information, startTime, endTime, mode, statusMode, complete }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authToken, authenticated } = useSelector(
        (state: RootState) => state.auth
    );
    const [show, setShow] = useState(false)

    const date = new Date(startTime)
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedDate = year + "/" + month + "/" + day;

    const from = new Date(startTime).toLocaleTimeString();
    const to = new Date(endTime).toLocaleTimeString();

    const enlargeHandler = () => {
        setShow(true)
    }

    const minimiseHandler = () => {
        setShow(false)
    }

    const declineHandler = () => {
        dispatch(declineappointment(_id, authToken))
    }

    const acceptHandler = () => {
        dispatch(acceptappointment(_id, authToken))
    }

    const createHealthcareHandler = () => {
        return navigate("/healthcareCreate/" + _id)
    }

    const deleteAppointmentHandler = () => {
        dispatch(cancelappointment(_id, authToken))
    }

    return (
        <div className={mode == "Client" ? (statusMode == "Pending" ? (dateInPast(startTime) ? classes.WrapperClientModeExpired : classes.WrapperClientMode) : statusMode == "Set" ? classes.WrapperClientModeSet : classes.WrapperClientModeDeclined) : (statusMode == "Pending" ? classes.WrapperTherapistMode : (statusMode == "Set" ? classes.WrapperTherapistModeSet : classes.WrapperTherapistModeDeclined))} onMouseEnter={enlargeHandler} onMouseLeave={minimiseHandler}>
            {/* Client Mode View */}
            <div className={classes.Professional}>
                <label>{mode == "Client" ? therapist : client}</label>
            </div>
            <div className={classes.DateAndTime}>
                <div className={classes.Date}>
                    <label>{formattedDate}</label>
                </div>
                <div className={classes.Time}>
                    <label>{from}</label>
                    <label>-</label>
                    <label>{to}</label>
                </div>
                {mode == "Client" ?
                    <div className={statusMode == "Set" ? classes.DeleteIconSet : classes.DeleteIconPending}>
                        {statusMode == "Pending" || statusMode == "Set" ? ['top'].map((placement) => (
                            <OverlayTrigger
                                key={placement}
                                placement={"top"}
                                overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                        <strong>{dateInPast(startTime) ? "Delete expired appointment" : "Cancel appointment"}</strong>
                                    </Tooltip>
                                }
                            >
                                <i className="fa-regular fa-calendar-xmark" onClick={deleteAppointmentHandler}></i>
                            </OverlayTrigger>
                        ))
                            : <label>Declined</label>}
                    </div>
                    :
                    null}
                {/* Therapist Mode View of a Set or Pending appointment*/}
                {mode == "Therapist" && statusMode == "Set" ?
                    <div className={classes.CreateHealthcare}>
                        {['top'].map((placement) => (
                            <OverlayTrigger
                                key={placement}
                                placement={"top"}
                                overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                        <strong>Create a healthcare</strong>
                                    </Tooltip>
                                }
                            >
                                <i className="fa-solid fa-file-medical" onClick={createHealthcareHandler}></i>
                            </OverlayTrigger>
                        ))}
                    </div>
                    :
                    null}
            </div>
            {mode == "Therapist" && statusMode == "Pending" ?
                <div className={show ? classes.DisplayAdditionalInformationOpen : classes.DisplayAdditionalInformationClosed}>
                    <div className={classes.AdditionalDate}>
                        <label>Date: {formattedDate}</label>
                    </div>
                    <div className={classes.AdditionalDate}>
                        <label>Time: {from + "-" + to}</label>
                    </div>
                    <div className={classes.Name}>
                        <label>Name: {client}</label>
                    </div>
                    <div className={classes.InfoAndAction}>
                        <div className={classes.Info}>
                            <p>{information}</p>
                        </div>
                        <div className={classes.Buttons}>
                            {['top'].map((placement) => (
                                <OverlayTrigger
                                    key={placement}
                                    placement={"top"}
                                    overlay={
                                        <Tooltip id={`tooltip-${placement}`}>
                                            <strong>Decline Appointment</strong>
                                        </Tooltip>
                                    }
                                >
                                    <i onClick={declineHandler} id="Decline" className="fa-solid fa-square-xmark"></i>
                                </OverlayTrigger>
                            ))}
                            {['top'].map((placement) => (
                                <OverlayTrigger
                                    key={placement}
                                    placement={"top"}
                                    overlay={
                                        <Tooltip id={`tooltip-${placement}`}>
                                            <strong>Accept Appointment</strong>
                                        </Tooltip>
                                    }
                                >
                                    <i id="Accept" onClick={acceptHandler} className="fa-solid fa-square-check"></i>
                                </OverlayTrigger>
                            ))}
                        </div>
                    </div>
                </div>
                :
                null}
        </div>
    );
}

export default AppointmentItem;