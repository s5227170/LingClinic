import React, { FC, Fragment, useEffect, useState } from 'react';
import {
    Inject, ScheduleComponent, Week,
    Month,
    Agenda,
} from '@syncfusion/ej2-react-schedule';
import { enableRipple } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { v4 as uuid } from "uuid";

import classes from './AppointmentRehabilitator.module.css';
import { css } from "@emotion/react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { bookrehabilitatorappointments, emptyschedule, getschedule, setAppointmentError, setAppointmentSuccess } from '../../store/actions/appointments';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { clearhealthcare, gethealthcare } from '../../store/actions/healthcare';
import { PuffLoader } from 'react-spinners';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import IconWithTooltip from '../../components/interface/IconWithTooltip/IconWithTooltip';

const AppointmentRehabilitator: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    enableRipple(true);
    L10n.load({
        'en-US': {
            'schedule': {
                'saveButton': 'Add',
                'cancelButton': 'Close',
                'deleteButton': 'Remove',
                'newEvent': 'Book appointment',
            },
        }
    });
    const loader = css`
    margin: 5rem auto 1rem auto;
    `

    const { authToken, authenticated } = useSelector((state: RootState) => state.auth);
    const { healthcare } = useSelector((state: RootState) => state.healthcare);
    const { success, schedule, loading, error } = useSelector((state: RootState) => state.appointments);

    const [rehabilitators, setRehabilitators] = useState(["Jim Bouwey"])
    const [rehabilitator, setRehabilitator] = useState("");
    const [requiredAppointments, setRequiredAppointments] = useState(0);
    const [updatedData, setUpdatedData] = useState<Array<any>>([]);
    const [data, setData] = useState<Array<any>>([]);
    const [max, setMax] = useState(0);
    const [updater, setUpdater] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(gethealthcare(id, authToken))
        } else {
            return navigate("/healthcareView/" + id)
        }

    }, [])

    const returnHandler = () => {
        if (authenticated) {
            return navigate("/healthcareView/" + id)
        }
        return navigate("/authenticate")
    }

    const dataHandler = (e) => {
        e.element.align = "center"
        if (e.data.IsBlock) {
            e.element.innerText = "Taken" + "\n" + e.data.StartTime.getHours() + ":" + (e.data.StartTime.getMinutes() < 10 ? '0' : '') + e.data.StartTime.getMinutes() + " - " + e.data.EndTime.getHours() + ":" + (e.data.EndTime.getMinutes() < 10 ? '0' : '') + e.data.EndTime.getMinutes()
            e.data.Subject = "Taken";
            e.Subject = "Taken";
        } else {
            e.element.innerText = "Rehabilitator" + "\n" + e.data.StartTime.getHours() + ":" + (e.data.StartTime.getMinutes() < 10 ? '0' : '') + e.data.StartTime.getMinutes() + " - " + e.data.EndTime.getHours() + ":" + (e.data.EndTime.getMinutes() < 10 ? '0' : '') + e.data.EndTime.getMinutes()
            e.data.Subject = "Rehabilitator Appointment";
            e.Subject = "Rehabilitator Appointment";
        }

        setUpdater(!updater)
    };

    useEffect(() => {
        if (success.length > 0) {
            return navigate("/healthcareView/" + id);
        }

        return () => {
            dispatch(setAppointmentSuccess(""))
            dispatch(clearhealthcare())
            dispatch(emptyschedule())
        }
    }, [success])

    const submitHandler = () => {

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
            for (let i = 0; i < cleanData.length; i++) {
                filteredData.push(cleanData.splice(cleanData.length - healthcare!.appointmentsRehabRequired + i, healthcare!.appointmentsRehabRequired + i))
            }
        }

        if (!filteredData[0]) {
            return dispatch(setAppointmentError("You haven't picked any appointments."))
        }

        for (let i = 0; i < filteredData[0].length; i++) {
            filteredData[0][i] = { ...filteredData[0][i], _id: uuid(), IsBlock: true }
        }

        if (filteredData[0].length != healthcare!.appointmentsRehabRequired) {
            return dispatch(setAppointmentError("Please set all required appointments."))
        }

        dispatch(bookrehabilitatorappointments(authToken, rehabilitator, healthcare!._id, filteredData[0]))
    }

    const rehabilitatorHandler = (e) => {
        setRehabilitator(e.itemData.value)
    }

    useEffect(() => {
        if (rehabilitator && !schedule) {
            dispatch(getschedule(rehabilitator, authToken, "Rehabilitator"))
        }
    }, [rehabilitator])

    useEffect(() => {
        if (schedule) {
            setData(schedule)
        }
    }, [schedule])

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
                {healthcare ?
                    <Fragment>
                        <div className={classes.Header}>
                            <h4>Book rehabilitator appointments</h4>
                            <IconWithTooltip position={"top"} clickHandler={returnHandler} tooltip={"Go back"}>
                                <i onClick={returnHandler} className="fa-regular fa-circle-left"></i>
                            </IconWithTooltip>
                        </div>
                        <div className={classes.Content}>
                            {/* Add the document download list here */}
                            <label>Please choose a rehabilitator in order to see available bookings</label>
                            <DropDownListComponent id="ddlelement" change={rehabilitatorHandler} value={rehabilitator} dataSource={rehabilitators} placeholder="Select a rehabilitator" />
                            <div className={classes.Instructions}>

                                <div className={classes.AppointmentMarks}>
                                    {[...Array(10)].map((element, index) => {
                                        let filteredData: any[] = [];
                                        if (data.filter(attribute => attribute.Subject == "Add title")) {
                                            filteredData = [...data.filter(attribute => attribute.Subject == "Add title")]
                                        }

                                        if (index < healthcare!.appointmentsRehabRequired && (!filteredData[index] || max == 0)) {
                                            return (
                                                <div key={uuid()} className={classes.MarkRequired}></div>
                                            )
                                        } else if (index < healthcare!.appointmentsRehabRequired && filteredData[index]) {
                                            return (
                                                <div key={uuid()} className={classes.MarkTaken}></div>
                                            )
                                        } else {
                                            return (
                                                <div key={uuid()} className={classes.MarkFree}></div>
                                            )
                                        }
                                    })}
                                </div>
                                {healthcare?.appointmentsRehabRequired == max ?
                                    <label>Complete...</label>
                                    :
                                    null}
                            </div>

                            {!loading && rehabilitator ?
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

                                    actionBegin={(e) => {
                                        let weekEnds = [0, 6];
                                        if (
                                            e.requestType == "eventCreate" &&
                                            weekEnds.indexOf(e.data[0].StartTime.getDay()) >= 0
                                        ) {
                                            console.log("breaks1")
                                            return e.cancel = true;
                                        }
                                        if (e.requestType == "eventCreate" && !rehabilitator) {
                                            dispatch(setAppointmentError("Please choose a Rehabilitator first."))
                                            return e.cancel = true
                                        } else
                                            if (e.requestType == "eventRemove") {
                                                setMax(max - 1)
                                            } else
                                                if ((e.requestType == "eventCreate") && max >= healthcare!.appointmentsRehabRequired) {
                                                    console.log("breaks2")
                                                    return e.cancel = true
                                                } else
                                                    if (e.requestType == "eventCreate") {
                                                        e.data[0].Id = uuid()
                                                        console.log(e)
                                                        setMax(max + 1)
                                                    }

                                    }}
                                >
                                    <Inject services={[Week, Month, Agenda]} />
                                </ScheduleComponent>
                                :
                                <h6>Choose a rehabilitator to continue</h6>
                            }
                            <div className={classes.Submit}>
                                <ButtonComponent onClick={submitHandler} disabled={loading}>Book</ButtonComponent>
                            </div>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <PuffLoader css={loader} color={"#fff"} loading={!healthcare} size={300} />
                        <h4 style={{ textAlign: "center" }} className={classes.SpinnerText}>Loading...</h4>
                    </Fragment>}
            </div>
        </div>
    );
}

export default AppointmentRehabilitator;