import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { getallappointments, setAppointmentError, setAppointmentSuccess } from "../../store/actions/appointments";
import { v4 as uuid } from "uuid";

import classes from "./ClientAppointments.module.css";
import AppointmentTherapistList from "../../components/interface/AppointmentTherapistList/AppointmentTherapistList";
import BackgroundEffect from "../../components/HOC/BackroundEffect/BackgroundEffect";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import ErrorModal from "../../components/interface/ErrorModal/ErrorModal";
import SuccessModal from "../../components/interface/SuccessModal/SuccessModal";
const ClientAppointments: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authToken } = useSelector(
        (state: RootState) => state.auth
    );
    const { allAppointments, error, success } = useSelector(
        (state: RootState) => state.appointments
    );

    const [modes, setModes] = useState(["Healthcares", "Appointments", "Calendar"])
    const [mode, setMode] = useState("")

    useEffect(() => {
        dispatch(getallappointments(authToken));
    }, []);

    const chooseModehandler = (e) => {
        setMode(e.itemData.value)
    }

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
            <div className={classes.ClientAppointments}>
                <div className={classes.Header}>
                    <h2>Client Appointments</h2>
                    <div className={classes.Modes}>
                        <div className={classes.Mode}>
                            <DropDownListComponent id="ddlelement" change={chooseModehandler} value={mode} dataSource={modes} placeholder="Select mode" />
                        </div>
                    </div>
                </div>
                <label>Hover over appointments to see options</label>
                <div className={classes.Content}>
                    <div className={classes.Results} />
                    <div className={classes.Table}>
                        {/* {allAppointments ? */}
                        {/* <div className={classes.TableHeader}>
                        </div> */}
                        <div className={classes.TableContent}>
                            <div className={classes.Pending}>
                                <h5>Pending</h5>
                                {allAppointments ?
                                    <AppointmentTherapistList
                                        key={uuid()}
                                        mode="Pending"
                                        data={allAppointments}
                                        itemsPerPage={10}
                                        startFrom={1}
                                    />
                                    : null}
                            </div>
                            <div className={classes.Set}>
                                <h5>Set</h5>
                                {allAppointments ?
                                    <AppointmentTherapistList
                                        key={uuid()}
                                        mode="Set"
                                        data={allAppointments}
                                        itemsPerPage={10}
                                        startFrom={1}
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientAppointments;
