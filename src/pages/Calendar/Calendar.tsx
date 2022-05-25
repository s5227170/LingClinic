import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Inject, ScheduleComponent, Week, Month, Agenda } from '@syncfusion/ej2-react-schedule';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { emptyPersonalSchedule, getpersonalschedule } from '../../store/actions/appointments';

import classes from './Calendar.module.css';
const Calendar: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authToken, user } = useSelector(
        (state: RootState) => state.auth
    );
    const { personalSchedule } = useSelector(
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

    return (
        <div className={classes.Wrapper}>
            {/* Makeit so that a dispatch is sent first thing and then gets all appointments for the current professional according to the auth token uid */}
            {/* create a readonly scheduler and attach a drop-down like in other "Client" pages */}
            <div className={classes.Calendar}>
                <div className={classes.Header}>
                    <h2>Calendar</h2>
                    {/* @ts-ignore */}
                    {user.type == "Therapist" ?
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
                        }
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