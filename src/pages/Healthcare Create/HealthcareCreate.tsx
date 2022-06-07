import React, { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import { RootState } from '../../store';
import { createhealthcare, sethealthcareappointment, setHealthcareError, setHealthcareSuccess } from '../../store/actions/healthcare';
import { PuffLoader } from 'react-spinners';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { enableRipple } from '@syncfusion/ej2-base';

import classes from './HealthcareCreate.module.css';
import './HealthcareCreate.css';
import { css } from "@emotion/react";
import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-dropdowns/styles/material.css";
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import IconWithTooltip from '../../components/interface/IconWithTooltip/IconWithTooltip';

const HealthcareCreate: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    enableRipple(true);
    const { id } = useParams();

    const { authToken, authenticated } = useSelector((state: RootState) => state.auth);
    const { healthcareAppointment, success, error, loading } = useSelector((state: RootState) => state.healthcare);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [fileNames, setFileNames] = useState<Array<any>>([])
    const [formattedDate, ssetFormattedDate] = useState("")
    const [time, setTime] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [rehabAppointments, setRehabAppointments] = useState(0)
    const [appointmentAmountOption, setAppointmentAmountOption] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const [fileCleaner, setFileCleaner] = useState(true)
    const [fileDetails, setFileDetails] = useState<Array<any>>([])
    const [requirements, setRequirements] = useState<Array<any>>([])
    const [update, setUpdate] = useState("")
    const loader = css`
    margin: 5rem auto 1rem auto;
    `

    useEffect(() => {
        if (id && !healthcareAppointment)
            dispatch(sethealthcareappointment(id, authToken))
    }, [])

    useEffect(() => {
        if (success == "creation_success") {
            dispatch(setHealthcareSuccess(""))
            return navigate("/clientAppointments")
        }
    }, [success])

    useEffect(() => {
        if (healthcareAppointment) {
            const month = new Date(healthcareAppointment.StartTime).getMonth() + 1;
            const day = new Date(healthcareAppointment.StartTime).getDate();
            const year = new Date(healthcareAppointment.StartTime).getFullYear();
            ssetFormattedDate(year + "/" + month + "/" + day);

            const from = new Date(healthcareAppointment.StartTime).toLocaleTimeString();
            const to = new Date(healthcareAppointment.EndTime).toLocaleTimeString();
            setTime(from + "-" + to);
        }
    }, [healthcareAppointment])

    const returnHandler = () => {
        if (authenticated) {
            return navigate("/clientAppointments")
        }
        return navigate("/authenticate")
    }


    const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files.length > 10) {
                dispatch(setHealthcareError("Maximum amount of files allowed per healthcare is 10."))
                setFileNames([])
                setUploadedFiles([])
                return setFileCleaner(!fileCleaner)
            }
            setUpdate(uuid())
            let data: any[] = [];
            let newFileDetails: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                newFileDetails.push("")
                data.push(e.target.files[i])
            }
            setUploadedFiles(data)
            setFileDetails(newFileDetails)
            setFileNames(data)
        }
    }


    const deleteFileHandler = (target) => {
        let newData: any[] = [];
        let newFileDetails = [...fileDetails];

        if (uploadedFiles)
            for (let i = 0; i < uploadedFiles.length; i++) {

                if (i != target) {
                    newData.push(uploadedFiles[i]);
                    console.log(i)
                } else {
                    newFileDetails.splice(i, 1)
                }
            };
        if (newData.length == 0) {
            setFileCleaner(!fileCleaner)
        }
        setFileDetails(newFileDetails)
        setUploadedFiles(newData)
        setFileNames(newData)
    }

    const diagnosisHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setDiagnosis(e.currentTarget.value)
    }

    const rehabApointmentsHandler = (e) => {

        setRehabAppointments(e.itemData.value)
    }

    const submitHandler = () => {
        console.log(fileDetails)
        console.log(uploadedFiles)
        if (fileDetails.length != uploadedFiles?.length) {
            return dispatch(setHealthcareError("Please add information to all fields."))
        }

        if (rehabAppointments > 10 || rehabAppointments == 0) {
            return dispatch(setHealthcareError("Please choose the amount of rehabilitator appointments."))
        }

        if (!diagnosis || diagnosis.length == 0) {
            return dispatch(setHealthcareError("Please fill the diagnosis field."))
        }

        for (let i = 0; i < fileDetails.length; i++) {
            if (fileDetails[i] == "")
                return dispatch(setHealthcareError("Empty file descriptions"))
        }

        for (let i = 0; i < requirements.length; i++) {
            if (requirements[i] == "")
                return dispatch(setHealthcareError("Empty requirement descriptions"))
        }

        if (healthcareAppointment) {
            dispatch(createhealthcare(healthcareAppointment._id, diagnosis, rehabAppointments, requirements, authToken, uploadedFiles, fileDetails))
        }
    }

    const fileDetailsHandler = (e: ChangeEvent<HTMLInputElement>, index) => {
        let data = [...fileDetails];
        data[index] = e.currentTarget.value;
        setFileDetails(data)
    }

    const addRequirementHandler = () => {
        let newReqs: any[] = [...requirements];
        console.log(newReqs.length + 1)
        newReqs.push("")
        setRequirements(newReqs)
    }

    const requirementTextHandler = (e: ChangeEvent<HTMLInputElement>, index) => {
        let newReqs = [...requirements]
        newReqs[index] = e.currentTarget.value
        setRequirements(newReqs)
    }

    const removeRequirementHandler = (target) => {
        let newReqs: any[] = [];

        for (let i = 0; i < requirements.length; i++) {

            if (i != target) {
                newReqs.push(requirements[i])
            } else {
                newReqs.splice(i, 1)
            }
        }
        setRequirements(newReqs)
    }

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setHealthcareError(""))
            dispatch(setHealthcareSuccess(""))
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
            <div className={classes.CreateHealthcare}>
                {healthcareAppointment && !loading ?
                    <Fragment>
                        <div className={classes.Header}>
                            <h2>Healthcare</h2>
                            <IconWithTooltip position={"top"} clickHandler={returnHandler} tooltip={"Go back"}>
                                <i onClick={returnHandler} className="fa-regular fa-circle-left"></i>
                            </IconWithTooltip>
                        </div>
                        <div className={classes.Content}>
                            <div className={classes.AppointmentInfo}>
                                <div className={classes.Info}>
                                    <h4><u>Therapist appointment information</u></h4>
                                    <h5>Client:</h5>
                                    <label><i>{healthcareAppointment.client}</i></label>
                                    <h5>Date and time of appointment:</h5>
                                    <label><i>{formattedDate + ", " + time}</i></label>
                                    <h5>Information:</h5>
                                    <label><i>{healthcareAppointment.information}</i></label>
                                </div>
                                <div className={classes.RequiredDocs}>
                                    <div className={classes.AddRequirement} onClick={addRequirementHandler}>
                                        <span className="material-icons-outlined">
                                            add_circle_outline
                                        </span>
                                        <label>Add a requirement</label>
                                    </div>
                                    {requirements.map((item, index) => {
                                        return (
                                            <div className={classes.Requirement}>
                                                <input key={index} value={requirements[index]} onChange={e => { requirementTextHandler(e, index) }} type="text" className="e-input" placeholder={"Enter a requirement"} />
                                                <span className="material-icons-outlined" onClick={() => removeRequirementHandler(index)}>
                                                    remove_circle_outline
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={classes.Details}>
                                <input onChange={diagnosisHandler} value={diagnosis} className="e-input" type="text" placeholder="Enter a diagnosis" />
                            </div>
                            <div className={classes.DropDownWrapper}>
                                <DropDownListComponent id="ddlelement" change={rehabApointmentsHandler} value={rehabAppointments} dataSource={appointmentAmountOption} placeholder="Select rehabilitator appointments amount" />
                            </div>
                            <div className={classes.Files}>
                                <label><u>Please select all files and documents regarding the current healthcare at once.</u></label>
                                <input name="docs" key={fileCleaner ? "valueOne" : "valueTwo"} type="file" onChange={fileHandler} style={{ "color": "transparent" }} multiple />
                                {fileNames.map((file, index) => {
                                    return (<div className={classes.FileItem}>
                                        <div className={classes.FileItemNameAndDelete}>
                                            <p key={uuid()} >{file.name}</p>
                                            <i className="fa-regular fa-trash-can" onClick={() => { deleteFileHandler(index) }}></i>
                                        </div>
                                        <div className={classes.FileItemInformation}>
                                            <input key={index} value={fileDetails[index]} onChange={(e) => { fileDetailsHandler(e, index) }} className="e-input" type="text" placeholder="Provide information about the image" />
                                        </div>
                                    </div>)
                                })}
                            </div>
                            <div className={classes.Submit}>
                                <ButtonComponent onClick={submitHandler} disabled={loading}>Create Healthcare</ButtonComponent>
                            </div>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <PuffLoader css={loader} color={"#fff"} loading={!healthcareAppointment || loading} size={300} />
                        <h4 className={classes.SpinnerText}>Loading...</h4>
                    </Fragment>}
            </div>
            {/* Diagnosis */}
            {/* Appointments required */}
            {/* Documents */}

        </div >
    );
}

export default HealthcareCreate;