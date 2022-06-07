import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Inject, ScheduleComponent, Week, Month, Agenda } from '@syncfusion/ej2-react-schedule';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import { RootState } from '../../store';
import { emptyPersonalSchedule, getpersonalschedule, setAppointmentError, setAppointmentSuccess } from '../../store/actions/appointments';

import classes from './Calendar.module.css';
const Calendar: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authToken, user } = useSelector(
        (state: RootState) => state.auth
    );
    const { personalSchedule, error, success } = useSelector(
        (state: RootState) => state.appointments
    );

    const [data, setData] = useState<Array<any>>([])
    const [modes, setModes] = useState(["Healthcares", "Appointments", "Calendar"])
    const [mode, setMode] = useState("")
    const [rehabModes, setRehabModes] = useState(["Healthcares", "Calendar"])
    const [rehabMode, setRehabMode] = useState("")
    const [updater, setUpdater] = useState(false)

    useEffect(() => {
        if (user && !personalSchedule) {
            // @ts-ignore
            dispatch(getpersonalschedule(authToken, user.type))
        }

        return () => {
            dispatch(emptyPersonalSchedule())
        }
    }, [])

    useEffect(() => {
        if (mode) {
            if (mode == "Healthcares") {
                return navigate("/clientHealthcares");
            }
            if (mode == "Appointments") {
                return navigate("/clientAppointments");
            }
            if (mode == "Calendar") {
                return navigate("/Calendar");
            }
        }
    }, [mode])

    useEffect(() => {
        if (personalSchedule) {
            setData(personalSchedule!)
        }
    }, [personalSchedule])

    const chooseTherapistModehandler = (e) => {
        setMode(e.itemData.value)
    }

    const chooseRehabModehandler = (e) => {
        setMode(e.itemData.value)
    }

    const dataHandler = (e) => {
        setUpdater(!updater)
    };

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setAppointmentSuccess(""))
            dispatch(setAppointmentError(""))
        }
    }

    return (
        <div className={classes.Wrapper}>
            <BackgroundEffect />
            {error.length > 0 ?
                <ErrorModal message={error} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            {success.length > 0 ?
                <SuccessModal message={success} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            <div className={classes.Calendar}>
                <div className={classes.Header}>
                    <h2>Calendar</h2>
                    {user ?
                        user.type == "Therapist" ?
                            <div className={classes.Modes}>
                                <div className={classes.Mode}>
                                    <DropDownListComponent id="ddlelement" change={chooseTherapistModehandler} value={mode} dataSource={modes} placeholder="Select mode" />
                                </div>

                            </div>
                            :
                            <div className={classes.Modes}>
                                <div className={classes.Mode}>
                                    <DropDownListComponent id="ddlelement" change={chooseRehabModehandler} value={rehabMode} dataSource={rehabModes} placeholder="Select mode" />
                                </div>

                            </div>
                        : null}
                </div>
                <div className={classes.Content}>
                    <div className={classes.Scheduler}>
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
                            readonly={true}
                        >
                            <Inject services={[Week, Month, Agenda]} />
                        </ScheduleComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;