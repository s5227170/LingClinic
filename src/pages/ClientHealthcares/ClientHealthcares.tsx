import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import HealthcareProfessionalList from '../../components/interface/HealthcareProfessionalList/HealthcareProfessionalList';
import { RootState } from '../../store';
import { v4 as uuid } from "uuid";
import { emptyhealthcares, listhealthcares, setHealthcareError, setHealthcareSuccess } from '../../store/actions/healthcare';

import classes from './ClientHealthcares.module.css';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
const ClientHealthcares: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authToken, user } = useSelector(
        (state: RootState) => state.auth
    );
    const { healthcareList, error, success } = useSelector(
        (state: RootState) => state.healthcare
    );

    const [therapistModes, setTherapistModes] = useState(["Healthcares", "Appointments", "Calendar"])
    const [therapistMode, setTherapistMode] = useState("")
    const [rehabModes, setRehabModes] = useState(["Healthcares", "Calendar"])
    const [rehabMode, setRehabMode] = useState("")
    const [dataList, setDataList] = useState(false);

    useEffect(() => {
        dispatch(listhealthcares(authToken))

        return () => {
            dispatch(emptyhealthcares())
            dispatch(setHealthcareSuccess(""))
        }
    }, [])

    useEffect(() => {
        if (healthcareList) {
            dispatch(setHealthcareSuccess(""))
            setDataList(true)
        }
    }, [healthcareList])


    useEffect(() => {
        if (therapistMode) {
            if (therapistMode == "Healthcares") {
                return navigate("/clientHealthcares");
            }
            if (therapistMode == "Appointments") {
                return navigate("/clientAppointments");
            }
            if (therapistMode == "Calendar") {
                return navigate("/Calendar");
            }
        }
    }, [therapistMode])

    useEffect(() => {
        if (rehabMode) {
            if (rehabMode == "Healthcares") {
                return navigate("/clientHealthcares");
            }
            if (rehabMode == "Calendar") {
                return navigate("/Calendar");
            }
        }
    }, [rehabMode])

    const chooseTherapistModehandler = (e) => {
        setTherapistMode(e.itemData.value)
    }

    const chooseRehabModehandler = (e) => {
        setRehabMode(e.itemData.value)
    }

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setHealthcareSuccess(""))
            dispatch(setHealthcareError(""))
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
            <div className={classes.ClientHealthcares}>
                <div className={classes.Header}>
                    <h2>Client Healthcares</h2>
                    {/* @ts-ignore */}
                    {user.type == "Therapist" ?
                        <div className={classes.Modes}>
                            <div className={classes.Mode}>
                                <DropDownListComponent id="ddlelement" change={chooseTherapistModehandler} value={therapistMode} dataSource={therapistModes} placeholder="Select mode" />
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
                    <label>Slide table if using a mobile phone</label>
                    {dataList ?
                        <Fragment>
                            <table>
                                <thead>
                                    <tr>
                                        <th className={classes.ClientCell}>Client</th>
                                        <th className={classes.DiagnosisCell}>Diagnosis</th>
                                        <th className={classes.RehabilitatorAppointmentCell}>Rehabilitator Appointments</th>
                                        <th className={classes.RehabilitatorCell}>Rehabilitator</th>
                                        <th className={classes.TherapistCell}>Therapist</th>
                                        <th className={classes.InitialisedCell}>Initialised</th>
                                        <th className={classes.ViewCell}>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {healthcareList ?
                                        <HealthcareProfessionalList key={uuid()} data={healthcareList} itemsPerPage={10} startFrom={1} />
                                        :
                                        null}
                                </tbody>
                            </table>
                        </Fragment>
                        :

                        <h4 style={{ textAlign: "center" }} >No healthcares currently</h4>
                    }
                </div>
            </div>
        </div>
    );
}

export default ClientHealthcares;