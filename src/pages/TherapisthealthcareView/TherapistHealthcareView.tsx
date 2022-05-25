import React, { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { enableRipple } from '@syncfusion/ej2-base';
import { RootState } from '../../store';
import { v4 as uuid } from "uuid";

import classes from './TherapistHealthcareView.module.css';
import { css } from "@emotion/react";
import { PuffLoader } from 'react-spinners';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import DocFile from '../../components/interface/DocFile/DocFile';
import { clearhealthcare, closehealthcare, gethealthcare, seenhealthcare, setHealthcareError, setHealthcareSuccess, updatehealthcare } from '../../store/actions/healthcare';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const TherapistHealthcareView: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    enableRipple(true);
    const { id } = useParams();

    const { authToken, authenticated, user } = useSelector((state: RootState) => state.auth);
    const { healthcare, docLinks, clientDocLinks, success, error, loading } = useSelector((state: RootState) => state.healthcare);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [fileNames, setFileNames] = useState<Array<any>>([])
    const [fileCleaner, setFileCleaner] = useState(true)
    const [fileDetails, setFileDetails] = useState<Array<any>>([])
    const [requirements, setRequirements] = useState<Array<any>>([])
    const [update, setUpdate] = useState("")
    const [changeConfirmation, setChangeConfirmation] = useState(true)
    const [mode, setmode] = useState("")
    const [confirmationReqs, setConfirmationReqs] = useState(true)
    const [confirmationDocs, setConfirmationDocs] = useState(true)
    const [warning, setWarning] = useState(false)
    const loader = css`
    margin: 5rem auto 1rem auto;
    `

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
        if (success && id) {
            dispatch(setHealthcareSuccess(""))
            dispatch(gethealthcare(id, authToken))
        }
    }, [success])

    useEffect(() => {
      if(success == "success" || success == "success_update") {
        return navigate("/clientHealthcares")
      }
    }, [success]) 

    useEffect(() => {
        if (healthcare) {
            if (healthcare.therapistRequirement == true) {
                setChangeConfirmation(false)
            }
        }
    }, [healthcare])

    const returnHandler = () => {
        if (authenticated) {
            return navigate("/clientHealthcares")
        }
        return navigate("/authenticate")
    }

    const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmationDocs(false)
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
        setConfirmationDocs(false)
        let newData: any[] = [];
        let newFileDetails = [...fileDetails];

        if (uploadedFiles)
            for (let i = 0; i < uploadedFiles.length; i++) {

                if (i != target) {
                    newData.push(uploadedFiles[i]);
                } else {
                    newFileDetails.splice(i, 1)
                }
            };
            if(newData.length == 0 && requirements.length > 0) {
                setmode("requirements")
            }
        setFileDetails(newFileDetails)
        setUploadedFiles(newData)
        setFileNames(newData)
    }

    const fileDetailsHandler = (e: ChangeEvent<HTMLInputElement>, index) => {
        setConfirmationDocs(false)
        let data = [...fileDetails];
        data[index] = e.currentTarget.value;
        setFileDetails(data)
    }

    const addRequirementHandler = () => {
        setConfirmationReqs(false)
        let newReqs: any[] = [...requirements];
        newReqs.push("")
        setRequirements(newReqs)
    }

    const requirementTextHandler = (e: ChangeEvent<HTMLInputElement>, index) => {
        setConfirmationReqs(false)
        let newReqs = [...requirements]
        newReqs[index] = e.currentTarget.value
        setRequirements(newReqs)
    }

    const removeRequirementHandler = (target) => {
        let newReqs: any[] = [];
        setConfirmationReqs(false)

        for (let i = 0; i < requirements.length; i++) {

            if (i != target) {
                newReqs.push(requirements[i])
            } else {
                newReqs.splice(i, 1)
            }
        }
        if(newReqs.length == 0 && uploadedFiles.length > 0) {
            setmode("documents")
        }
        setRequirements(newReqs)
    }

    const submitUploadHandler = () => {
        if(uploadedFiles.length == 0 && fileDetails.length == 0) {
            setConfirmationDocs(true)
        }
        if(requirements.length == 0) {
            setConfirmationReqs(true)
        }

        if (!confirmationReqs || !confirmationDocs) {
            return dispatch(setHealthcareError("Please confirm changes."))
        }

        if (uploadedFiles.length > 0 || fileDetails.length > 0) {
            if (uploadedFiles.length != fileDetails.length) {
                setConfirmationDocs(false)
                return dispatch(setHealthcareError("Please add details for all files."))
            }
        }

        for(let i = 0; i < requirements.length; i++) {
            if(requirements[i] == "")
            return dispatch(setHealthcareError("Empty requirement descriptions"))
        }

        if (fileDetails.length > 0 && uploadedFiles!.length > 0 && fileDetails.length == uploadedFiles!.length) {
            setmode("documents")
        }

        if (requirements.length > 0 && (fileDetails.length == 0 || uploadedFiles!.length == 0)) {
            setmode("requirements")
        }

        if (requirements.length > 0 && fileDetails.length > 0 && uploadedFiles!.length > 0 && (fileDetails.length == uploadedFiles.length)) {
            setmode("mixed")
        }

        if(mode == "requirements" || mode == "documents" || mode == "mixed") {
            if(id)
            dispatch(updatehealthcare(id, authToken, mode, requirements, uploadedFiles, fileDetails))
        }
    }

    const seenHandler = () => {
        if(id)
        dispatch(seenhealthcare(authToken, id))
    }

    const completeHandler = () => {
        setWarning(true)
    }

    const completeConfirmedHandler = () => {
        setWarning(false)
        if(id)
        dispatch(closehealthcare(authToken, id))
    }

    const confirmReqsHandler = () => {

        if (requirements.length > 0 && (fileDetails.length == 0 || uploadedFiles!.length == 0)) {
            setmode("requirements")
            setConfirmationReqs(true)
        }
        if (requirements.length > 0 && fileDetails.length > 0 && uploadedFiles!.length > 0 && (fileDetails.length == uploadedFiles.length)) {
            setmode("mixed")
            setConfirmationReqs(true)
        }

    }

    const confirmDocsHandler = () => {
        if (fileDetails.length > 0 && uploadedFiles!.length > 0 && fileDetails.length == uploadedFiles!.length) {
            setmode("documents")
            setConfirmationDocs(true)
        }
        if (requirements.length > 0 && fileDetails.length > 0 && uploadedFiles!.length > 0 && (fileDetails.length == uploadedFiles.length)) {
            setmode("mixed")
            setConfirmationDocs(true)
        }
    }

    const dropModalHandler = (e) => {
        e.preventDefault();
        setWarning(false)
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
                {warning ?
                <div key={uuid()} className="Backdrop" onClick={dropModalHandler}>
                    <div className="Modal ">
                        <div className="Modal-header">
                            <h4 className="">Warning</h4>
                            <i className="fa-regular fa-circle-xmark" onClick={dropModalHandler}></i>
                        </div>
                        <h4>Are you sure you want to confirm the healthcare as completed? This is permanent.</h4>
                        <label onClick={completeConfirmedHandler} className={classes.ConfirmComplete}><u>Confirm</u></label>
                        <label  className={classes.DeclineComplete}><u onClick={dropModalHandler}>Decline</u></label>
                    </div>
                </div>
                :
                null}
            <div className={classes.ViewHealthcareTherapist}>
                {!loading && healthcare ?
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
                            {/* All current files */}
                            <div className={classes.CurrentFiles}>
                                <div className={classes.Documents}>
                                    {/* Client files */}
                                    <label>CLient uploaded documents</label>
                                    {healthcare.clientDocs.map((doc, index) => {
                                        return (
                                            <DocFile key={index} name={doc.name} information={doc.information} link={clientDocLinks![index]} />
                                        )
                                    })}
                                </div>
                                {/* Therapist files */}
                                <div className={classes.Documents}>
                                    <label>Therapist uploaded documents</label>
                                    {healthcare.documents.map((doc, index) => {
                                        return (
                                            <DocFile key={index} name={doc.name} information={doc.information} link={docLinks![index]} />
                                        )
                                    })}
                                </div>
                            </div>
                            {/* Requirements section */}
                            {/* @ts-ignore */}
                            <div className={classes.RequirementControl}>
                                {/* Required action light */}
                                <div className={classes.Action}>
                                    <div className={classes.ActionCombine}>
                                        {healthcare.therapistRequirement ? (
                                            <div className={classes.Changes}>
                                                <label>Unseen changes</label>
                                                <div className={classes.ActionLightOn}></div>
                                            </div>
                                        ) : (
                                            <div className={classes.Changes}>
                                                <label>No new changes</label>
                                                <div className={classes.ActionLightOff}></div>
                                            </div>
                                        )}
                                        <div className={classes.Changes}>
                                        <label>Status: </label>
                                        <label>{healthcare.complete? "Completed" : "Active"}</label>
                                        </div>
                                    </div>
                                    <div className={classes.ActionConfirm}>
                                        <label>Confirm client documents as seen</label>
                                        <ButtonComponent className={classes.SeenConfirm} onClick={seenHandler}>Mark changes as seen</ButtonComponent>
                                        <label>Mark healthcare as complete</label>
                                        <ButtonComponent className={classes.SeenConfirm} onClick={completeHandler}>Mark as complete</ButtonComponent>
                                    </div>
                                </div>
                                {/* Requirement control */}
                                <div className={classes.RequiredDocs}>
                                    <div className={classes.AddRequirement} onClick={addRequirementHandler}>
                                        <span className="material-icons-outlined">
                                            add_circle_outline
                                        </span>
                                        <label>Add a requirement</label>
                                    </div>
                                    {requirements.map((item, index) => {
                                        return (
                                            <div key={index} className={classes.Requirement}>
                                                <input value={requirements[index]} onChange={e => { requirementTextHandler(e, index) }} type="text" className="e-input" placeholder={"Enter a requirement"} />
                                                <span className="material-icons-outlined" onClick={() => removeRequirementHandler(index)}>
                                                    remove_circle_outline
                                                </span>
                                            </div>
                                        )
                                    })}
                                    {requirements.length > 0 ?
                                        <ButtonComponent disabled={confirmationReqs} onClick={confirmReqsHandler} >Confirm requirement changes</ButtonComponent>
                                        :
                                        null}
                                </div>
                                {/* Upload more document control */}
                                <div className={classes.Upload}>
                                    <label><u>Please select all files and documents regarding the current healthcare at once.</u></label>
                                    <div className={classes.UploadFiles}>
                                        <input name="docs" key={fileCleaner ? "valueOne" : "valueTwo"} type="file" onChange={fileHandler} style={{ "color": "transparent" }} multiple />
                                    </div>
                                    {fileNames.map((file, index) => {
                                        return (<div key={index} className={classes.FileItem}>
                                            <div className={classes.FileItemNameAndDelete}>
                                                <p  >{file.name}</p>
                                                <i className="fa-regular fa-trash-can" onClick={() => { deleteFileHandler(index) }}></i>
                                            </div>
                                            <div className={classes.FileItemInformation}>
                                                <input value={fileDetails[index]} onChange={(e) => { fileDetailsHandler(e, index) }} className="e-input" type="text" placeholder="Provide information about the image" />
                                            </div>
                                        </div>)
                                    })}
                                    {uploadedFiles.length > 0 ?
                                        <ButtonComponent disabled={confirmationDocs} onClick={confirmDocsHandler} >Confirm document changes</ButtonComponent>
                                        :
                                        null}
                                </div>
                                <label>Please confirm requirements and file uploads when done. In case of an alert when everything is onfirmed, click submit a second time</label>
                                <div className={classes.Submit}>
                                    {(fileDetails.length > 0 && uploadedFiles!.length > 0 && requirements.length > 0) ? <label>Current changes will include files and requirements.</label> : (fileDetails.length > 0 && uploadedFiles!.length > 0 && requirements.length == 0) ? <label>Current changes will include only files.</label> : (requirements.length > 0 && fileDetails.length == 0 && uploadedFiles!.length == 0) ? <label>Current changes will include only requirements</label> : <label>No changes currently</label>}
                                    <ButtonComponent onClick={submitUploadHandler} disabled={loading}>Submit changes</ButtonComponent>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <PuffLoader css={loader} color={"#fff"} loading={!healthcare || loading} size={300} />
                        <h4 className={classes.SpinnerText}>Loading...</h4>
                    </Fragment>}
            </div>
        </div>
    );
}

export default TherapistHealthcareView;