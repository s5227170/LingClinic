import React, { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import {
    ScheduleComponent,
    Week,
    Month,
    Agenda,
    Inject,
} from "@syncfusion/ej2-react-schedule";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';


import classes from './AppointmentTherapist.module.css';

import { css } from "@emotion/react";
import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-dropdowns/styles/material.css";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from 'react-redux';
import { booktherapistappointment, emptyschedule, getschedule, setAppointmentError, setAppointmentSuccess } from '../../store/actions/appointments';
import { PuffLoader } from 'react-spinners';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import IconWithTooltip from '../../components/interface/IconWithTooltip/IconWithTooltip';

const AppointmentTherapist: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    enableRipple(true);
    L10n.load({
        'en-US': {
            'schedule': {
                'saveButton': 'Add',
                'cancelButton': 'Close',
                'deleteButton': 'Delete appointment',
                'newEvent': 'Book appointment',
            },
        }
    });

    const loader = css`
    margin: 5rem auto 1rem auto;
    `

    const { authToken, authenticated } = useSelector((state: RootState) => state.auth);
    const { success, schedule, loading, error } = useSelector((state: RootState) => state.appointments);

    const [professionals, setProfessionals] = useState(["Bill Taylor"])
    const [updatedData, setUpdatedData] = useState<Array<any>>([]);
    const [data, setData] = useState<Array<any>>([]);
    const [therapist, setTherapist] = useState("");
    const [reason, setReason] = useState("")
    const [max, setMax] = useState(0);

    const dataHandler = (e) => {
        e.element.align = "center"
        if (e.data.IsBlock) {
            e.element.innerText = "Taken" + "\n" + e.data.StartTime.getHours() + ":" + (e.data.StartTime.getMinutes() < 10 ? '0' : '') + e.data.StartTime.getMinutes() + " - " + e.data.EndTime.getHours() + ":" + (e.data.EndTime.getMinutes() < 10 ? '0' : '') + e.data.EndTime.getMinutes()
            e.data.Subject = "Taken";
            e.Subject = "Taken";
        } else {
            e.element.innerText = "Therapist" + "\n" + e.data.StartTime.getHours() + ":" + (e.data.StartTime.getMinutes() < 10 ? '0' : '') + e.data.StartTime.getMinutes() + " - " + e.data.EndTime.getHours() + ":" + (e.data.EndTime.getMinutes() < 10 ? '0' : '') + e.data.EndTime.getMinutes()
            e.data.Subject = "Therapist Appointment";
            e.Subject = "Therapist Appointment";
        }

        setUpdatedData((data) => [...data, e.data]);
    };


    const returnHandler = () => {
        if (authenticated) {
            return navigate("/profile")
        }
        return navigate("/authenticate")
    }

    const therapistHandler = (e) => {
        setTherapist(e.itemData.value)
    }

    const reasonHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setReason(e.currentTarget.value)
    }

    useEffect(() => {
        if (success.length > 0) {
            return navigate("/profile");
        }

        return () => {
            dispatch(setAppointmentSuccess(""))
            dispatch(emptyschedule())
            dispatch(setAppointmentError(""))
        }
    }, [success])

    useEffect(() => {
        if (therapist && !schedule) {
            dispatch(getschedule(therapist, authToken, "Therapist"))
        }
    }, [therapist])

    useEffect(() => {
        if (schedule) {
            setData(schedule)
        }
    }, [schedule])

    const submitHandler = () => {

        if (max == 0) {
            return dispatch(setAppointmentError("Please pick a date for your appointment."))
        }
        if (reason.length == 0 || !reason) {
            return dispatch(setAppointmentError("Please enter a reason for the appointment."))
        }
        if (therapist == "" || therapist == null) {
            return dispatch(setAppointmentError("Please choose a therapist."))
        }

        let cleanData: any[] = [];
        for (let i = 0; i < data.length; i++) {
            cleanData[i] = { ...data[i], _id: uuid(), IsBlock: true }
            const { Description, EndTimezone, IsAllDay, Location, RecurrenceRule, StartTimezone, ...refinedData } = cleanData[i];
            cleanData[i] = refinedData
        }

        let filteredData: any[] = [];
        if (cleanData.length == 1) {
            filteredData.push(cleanData.slice(0, 1))
        } else {
            filteredData.push(cleanData.slice(cleanData.length - 1, cleanData.length))
        }

        for (let i = 0; i < filteredData[0].length; i++) {
            filteredData[0][i] = { ...filteredData[0][i], _id: uuid(), IsBlock: true }
        }

        dispatch(booktherapistappointment(authToken, therapist, reason, filteredData[0][0].StartTime, filteredData[0][0].EndTime))
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
            <div className={classes.Appointment}>
                {!loading ?
                    <Fragment>
                        <div className={classes.Header}>
                            <h2>Therapist Appointment</h2>
                            <IconWithTooltip position={"top"} clickHandler={returnHandler} tooltip={"Go back"}>
                                <i onClick={returnHandler} className="fa-regular fa-circle-left"></i>
                            </IconWithTooltip>
                        </div>
                        <div className={classes.Instructions}>
                            <label>Please choose a therapist in order to see available bookings</label>
                        </div>
                        <div className={classes.DropDownWrapper}>
                            <DropDownListComponent id="ddlelement" change={therapistHandler} value={therapist} dataSource={professionals} placeholder="Select a therapist" />
                        </div>
                        <div className={classes.Scheduler}>
                            <label>Please choose a time for your appointment. You can choose only one.</label>
                            {!loading && therapist ?
                                <ScheduleComponent
                                    width="100%"
                                    views={["Week", "WorkWeek", "Agenda"]}
                                    eventRendered={dataHandler}
                                    minDate={new Date()}
                                    startHour={"9:00"}
                                    endHour={"19:00"}
                                    timeFormat={"HH:mm"}
                                    timeScale={{ enable: true, interval: 120, slotCount: 1 }}
                                    eventSettings={{
                                        dataSource: data
                                    }}
                                    quickInfoTemplates={{ header: "" }}
                                    actionBegin={(e) => {
                                        let weekEnds = [0, 6];
                                        if (
                                            e.requestType == "eventCreate" &&
                                            weekEnds.indexOf(e.data[0].StartTime.getDay()) >= 0
                                        ) {
                                            return e.cancel = true;
                                        }
                                        if (e.requestType == "eventCreate" && !therapist) {
                                            e.cancel = true
                                            return dispatch(setAppointmentError("Please choose a therapist first."))
                                        } else
                                            if (e.requestType == "eventRemove") {
                                                setMax(max - 1)
                                            } else
                                                if (e.requestType == "eventCreate" && max >= 1) {
                                                    return e.cancel = true
                                                } else
                                                    if (e.requestType == "eventCreate") {
                                                        setMax(max + 1)
                                                    }

                                    }}
                                >
                                    <Inject services={[Week, Month, Agenda]} />
                                </ScheduleComponent>
                                :
                                <Fragment>
                                    <PuffLoader css={loader} color={"#fff"} loading={loading} size={300} />
                                    <h4 style={{ textAlign: "center" }} className={classes.SpinnerText}>Loading...</h4>
                                </Fragment>}
                        </div>
                        <div className={classes.Details}>
                            <input onChange={reasonHandler} value={reason} className="e-input" type="text" placeholder="Reason for appointment" />
                        </div>
                        <div className={classes.Submit}>
                            <ButtonComponent onClick={submitHandler} disabled={loading}>Book</ButtonComponent>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <PuffLoader css={loader} color={"#fff"} loading={loading} size={300} />
                        <h4 style={{ textAlign: "center" }} className={classes.SpinnerText}>Loading...</h4>
                    </Fragment>}
            </div>

        </div >
    );
}

export default AppointmentTherapist;