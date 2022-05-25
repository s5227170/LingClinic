import React, { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { enableRipple } from '@syncfusion/ej2-base';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    ScheduleComponent,
    Week,
    Month,
    Agenda,
    Inject,
} from "@syncfusion/ej2-react-schedule";
import { L10n } from '@syncfusion/ej2-base';
import { css } from "@emotion/react";

import classes from './HealthcareView.module.css';
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
import { PuffLoader } from 'react-spinners';
import { clearhealthcare, clientHealthcareUpload, gethealthcare, setHealthcareError, setHealthcareSuccess } from '../../store/actions/healthcare';
import DocFile from '../../components/interface/DocFile/DocFile';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import { v4 as uuid } from "uuid";
import { RehabilitatorAppointment } from '../../store/types';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const HealthcareView: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const { id } = useParams();

    const { authToken, authenticated } = useSelector((state: RootState) => state.auth);
    const { healthcare, docLinks, success, error, loading } = useSelector((state: RootState) => state.healthcare);
    const [fileCleaner, setFileCleaner] = useState(true)
    const [fileDetails, setFileDetails] = useState<Array<any>>([])
    const [update, setUpdate] = useState("")

    const [uploadedFiles, setUploadedFiles] = useState<File[]>()
    const [fileNames, setFileNames] = useState<Array<any>>([])

    const [data, setData] = useState<Array<any>>([]);
    const [updatedData, setUpdatedData] = useState<Array<any>>([]);
    const [formattedDate, ssetFormattedDate] = useState("")
    const [time, setTime] = useState("")

    const returnHandler = () => {
        if (authenticated) {
            return navigate("/profile")
        }
        return navigate("/authenticate")
    }

    useEffect(() => {
        if (id) {
            dispatch(gethealthcare(id, authToken))
        }

        return () => {
            dispatch(clearhealthcare())
            dispatch(setHealthcareSuccess(""))
        }
    }, [])

    useEffect(() => {
        if (success) {
            dispatch(gethealthcare(id!, authToken))
            dispatch(setHealthcareSuccess(""))
        }
    }, [success])


    useEffect(() => {
        if (healthcare) {
            const month = new Date(healthcare.appointmentTherapist.StartTime).getMonth() + 1;
            const day = new Date(healthcare.appointmentTherapist.StartTime).getDate();
            const year = new Date(healthcare.appointmentTherapist.StartTime).getFullYear();
            ssetFormattedDate(year + "/" + month + "/" + day);

            const from = new Date(healthcare.appointmentTherapist.StartTime).toLocaleTimeString();
            const to = new Date(healthcare.appointmentTherapist.EndTime).toLocaleTimeString();
            setTime(from + "-" + to);
            let rehabAppointments: RehabilitatorAppointment[] = []
            healthcare.appointmentsRehabilitator.map((item, index) => {
                rehabAppointments.push({ ...item, IsBlock: false, Subject: "Rehabilitator" })
            })
            setData(rehabAppointments)
        }
    }, [healthcare])

    const dataHandler = (e) => {
        console.log(e)
        if (e.data.id != healthcare?.appointmentTherapist._id) {
            e.element.style.backgroundColor = "#6AB05E";
            e.data.Subject = "Therapist"
        }
        setUpdatedData((data) => [...data, e.data]);
    };
    console.log(data)

    const rehabAppointmentHandler = () => {
        if (healthcare?.appointmentsRehabRequired == healthcare?.appointmentsRehabilitator.length) {
            return dispatch(setHealthcareError("All rehabilitator appointments already set."))
        }
        return navigate("/appointmentRehabilitator/" + id)
    }

    const submitUploadHandler = () => {
        if (healthcare?.requirements.length != uploadedFiles?.length) {
            return dispatch(setHealthcareError("Please upload only the requested amount of files."))
        }
        for(let i = 0; i < fileDetails.length; i++) {
            if(fileDetails[i] == "")
            return dispatch(setHealthcareError("Empty file descriptions"))
        }
        if (fileDetails.length != uploadedFiles?.length) {
            return dispatch(setHealthcareError("Please add information to all fields."))
        }

        dispatch(clientHealthcareUpload(healthcare!._id, authToken, uploadedFiles, fileDetails))
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

    const fileDetailsHandler = (e: ChangeEvent<HTMLInputElement>, index) => {
        let data = [...fileDetails];
        data[index] = e.currentTarget.value;
        setFileDetails(data)
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
            {/*  @ts-ignore */}
            {error.length > 0 ?
                <div key={uuid()} className="Backdrop" onClick={dropModalHandler}>
                    <div className="Modal Modal-error">
                        <div className="Modal-header">
                            <h4 className="Modal-error-header">Error</h4>
                            <i className="fa-regular fa-circle-xmark" onClick={dropModalHandler}></i>
                        </div>
                        <h4>{error}</h4>
                    </div>
                </div>
                :
                null}
            {/*  @ts-ignore */}
            {success.length > 0 ?
                <div key={uuid()} className="Backdrop" onClick={dropModalHandler}>
                    <div className="Modal Modal-success">
                        <div className="Modal-header">
                            <h4 className="Modal-success-header">Success</h4>
                            <i className="fa-regular fa-circle-xmark" onClick={dropModalHandler}></i>
                        </div>
                        <h4>{success}</h4>
                    </div>
                </div>
                :
                null}
            <div className={classes.ViewHealthcare}>
                {healthcare != null ?
                    <Fragment>
                        <div className={classes.Header}>
                            <h2>Healthcare</h2>
                            {['top'].map((placement) => (
                                <OverlayTrigger
                                    key={placement}
                                    placement={"top"}
                                    overlay={
                                        <Tooltip id={`tooltip-${placement}`}>
                                            <strong>Go back</strong>
                                        </Tooltip>
                                    }
                                >
                                    <i onClick={returnHandler} className="fa-regular fa-circle-left"></i>
                                </OverlayTrigger>
                            ))}
                        </div>
                        <div className={classes.Content}>
                            <div className={classes.InformationAndDocuments}>
                                <div className={classes.Info}>
                                    <h4><u>Healthcare information</u></h4>
                                    <h5>Client:</h5>
                                    <label><i>{healthcare.client}</i></label>
                                    <h5>Date and time of appointment:</h5>
                                    <label><i>{formattedDate + ", " + time}</i></label>
                                    <h5>Provided information:</h5>
                                    <label><i>{healthcare.appointmentTherapist.information}</i></label>
                                    <h5>Diagnosis</h5>
                                    <label><i>{healthcare.diagnosis}</i></label>
                                    <h5>Therapist:</h5>
                                    <label><i>{healthcare.therapist}</i></label>
                                    <h5>Rehabilitator:</h5>
                                    <label><i>{healthcare.rehabilitator}</i></label>
                                    <h5>Total rehabilitator sessions:</h5>
                                    <label><i>{healthcare.appointmentsRehabRequired}</i></label>
                                </div>
                                <div className={classes.Documents}>
                                    <h5>Documents</h5>
                                    {healthcare.documents.map((doc, index) => {
                                        return (
                                            <DocFile key={index} name={doc.name} information={doc.information} link={docLinks![index]} />
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={classes.Requirements}>
                                <div className={classes.Action}>
                                    {healthcare.requirements.length > 0 ? (
                                        <Fragment>
                                            <label>Action required</label>
                                            <div className={classes.ActionLightOn}></div>
                                        </Fragment>
                                    ) : (
                                            <Fragment>
                                                <label>No action required</label>
                                                <div className={classes.ActionLightOff}></div>
                                            </Fragment>
                                        )}
                                </div>
                                {healthcare.requirements.length > 0 ?
                                    <Fragment>
                                        {healthcare.requirements.map((item, index) => {
                                            return (
                                                <div className={classes.ItemToDownload}>
                                                    <label>{healthcare.requirements[index]}</label>
                                                </div>
                                            )
                                        })}
                                        <div className={classes.Upload}>
                                            <label><u>Please be careful when you upload the files. Only one submission is available.</u></label>
                                            <div className={classes.UploadFiles}>
                                                <input name="docs" key={fileCleaner ? "valueOne" : "valueTwo"} type="file" onChange={fileHandler} style={{ "color": "transparent" }} multiple />
                                            </div>
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
                                            <div className={classes.Submit}>
                                                <ButtonComponent onClick={submitUploadHandler} disabled={loading}>Submit</ButtonComponent>
                                            </div>
                                        </div>
                                    </Fragment>
                                    :
                                    null}
                            </div>
                            <div className={classes.Scheduler}>
                                <div className={classes.Appointments}>
                                    <label>Current appointments</label>
                                    {healthcare.appointmentsRehabilitator.length == 0 ?
                                        <button onClick={rehabAppointmentHandler}><u>Book rehabilitator appointments</u></button>
                                        :
                                        null}
                                </div>
                                <ScheduleComponent
                                    width="100%"
                                    views={["Week", "WorkWeek", "Agenda"]}
                                    eventRendered={dataHandler}
                                    minDate={new Date()}
                                    startHour={"9:00"}
                                    endHour={"19:00"}
                                    timeFormat={"HH:mm"}
                                    timeScale={{ enable: true, interval: 120, slotCount: 1 }}
                                    selectedDate={new Date(healthcare.appointmentTherapist.StartTime)}
                                    eventSettings={{
                                        dataSource: [...data, { id: healthcare.appointmentTherapist._id, Subject: "Therapist", StartTime: healthcare.appointmentTherapist.StartTime, EndTime: healthcare.appointmentTherapist.EndTime, isReadOnly: true }]
                                    }}
                                    readonly={true}
                                >
                                    <Inject services={[Week, Month, Agenda]} />
                                </ScheduleComponent>
                            </div>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <PuffLoader css={loader} color={"#fff"} loading={!healthcare} size={300} />
                        <h4 className={classes.SpinnerText}>Loading...</h4>
                    </Fragment>}
            </div>
        </div>
    );
}

export default HealthcareView;