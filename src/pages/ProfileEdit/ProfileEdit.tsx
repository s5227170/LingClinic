import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';
import IconWithTooltip from '../../components/interface/IconWithTooltip/IconWithTooltip';
import SuccessModal from '../../components/interface/SuccessModal/SuccessModal';
import { RootState } from '../../store';
import { setError, setSuccess, updateuser, updateuserpassword } from '../../store/actions/auth';
import avatar from '../../static/images/unknown.png';

import classes from './ProfileEdit.module.css';
import FileUploadInput from '../../components/interface/FileUploadInput/FileUploadInput';

const ProfileEdit: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, userAvatar, authenticated, authToken, successAuth, error } = useSelector((state: RootState) => state.auth);
    const [password, setPassword] = useState<string>("")
    const [repeatPassword, setRepeatPassword] = useState<string>("")
    const [forename, setForename] = useState<string>("")
    const [surname, setSurname] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    const [mode, setMode] = useState("")

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setSuccess(""))
            dispatch(setError(""))
        }
    }

    const returnHandler = () => {
        if (authenticated) {
            return navigate("/profile")
        }
        return navigate("/authenticate")
    }

    const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value)
    }

    const repeatPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.currentTarget.value)
    }

    const forenameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setForename(e.currentTarget.value)
    }

    const surnameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSurname(e.currentTarget.value)
    }

    const avatarFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatarFile(e.target.files[0])
            setMode("Avatar")
            console.log(e.target.files)
        }
    }

    const modeHandler = (type: "Forename" | "Surname" | "Passwords" | "Avatar") => {
        setMode(type)
    }

    useEffect(() => {
        if (user) {
            if (mode == "Forename") {
                if (forename.length == 0) {
                    dispatch(setError("Please enter a forename."))
                } else {
                    dispatch(updateuser({ ...user, forename: forename }, authToken))
                }
            }
            if (mode == "Surname") {
                if (surname.length == 0) {
                    dispatch(setError("Please enter a surname."))
                } else {
                    dispatch(updateuser({ ...user, surname: surname }, authToken))
                }
            }
            if (mode == "Passwords") {
                if (password !== repeatPassword) {
                    dispatch(setError("Passwords don't match"))
                } else if (password.length == 0 || repeatPassword.length == 0) {
                    dispatch(setError("Please enter a password."))
                } else {
                    dispatch(updateuserpassword(password))
                }
            }
            if (mode == "Avatar") {
                if (!avatarFile) {
                    dispatch(setError("No file has been uploaded"))
                } else {
                    if (avatarFile != null) {
                        dispatch(updateuser({ ...user }, authToken, avatarFile))
                    } else {
                        dispatch(updateuser({ ...user }, authToken))
                    }
                }
            }
            setMode("")
        }
    }, [mode])

    return (
        <div className={classes.Wrapper}>
            <BackgroundEffect />
            {/*  @ts-ignore */}
            {error.length > 0 ?
                <ErrorModal message={error} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            {/*  @ts-ignore */}
            {successAuth.length > 0 ?
                <SuccessModal message={successAuth} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            <div className={classes.ProfileEdit}>
                <div className={classes.Header}>
                    <div className={classes.Title}>
                        <h3>Edit Profile</h3>
                    </div>
                    <div className={classes.Return}>
                        <IconWithTooltip position={"top"} clickHandler={returnHandler} tooltip={"Go back"}>
                            <i onClick={returnHandler} className="fa-regular fa-circle-left"></i>
                        </IconWithTooltip>
                    </div>
                </div>
                <div className={classes.Content}>
                    <div className={classes.Avatar}>
                        <div className={classes.AvatarImage}>
                            <img src={userAvatar ? userAvatar.length > 0 ? userAvatar : avatar : avatar} />
                        </div>
                        <div className={classes.Upload}>
                            <FileUploadInput onChange={avatarFileHandler} />
                        </div>
                    </div>
                    <div className={classes.Names}>
                        <h5>Change Name</h5>
                        <hr></hr>
                        <div className={classes.NameItem}>
                            <div className={classes.NameLabel}>
                                <label>{user ? user.forename : null}</label>
                            </div>
                            <div className={classes.InputWithButton}>
                                <input onChange={forenameHandler} value={forename} className="e-input" type="text" placeholder="Forename" />
                                <IconWithTooltip position="top" tooltip="Save Forename">
                                    <button onClick={() => modeHandler("Forename")}><i className="fa-regular fa-floppy-disk"></i></button>
                                </IconWithTooltip>
                            </div>
                        </div>
                        <div className={classes.NameItem}>
                            <div className={classes.NameLabel}>
                                <label>{user ? user.surname : null}</label>
                            </div>
                            <div className={classes.InputWithButton}>
                                <input onChange={surnameHandler} value={surname} className="e-input" type="text" placeholder="Surname" />
                                <IconWithTooltip position="top" tooltip="Save Surname">
                                    <button onClick={() => modeHandler("Surname")}><i className="fa-regular fa-floppy-disk"></i></button>
                                </IconWithTooltip>
                            </div>
                        </div>
                    </div>
                    <div className={classes.Password}>
                        <h5>Change Password</h5>
                        <hr></hr>
                        <div className={classes.PasswordItems}>
                            <div className={classes.PasswordInputs}>
                                <input onChange={passwordHandler} value={password} className="e-input" type="password" placeholder="Password" />
                                <input onChange={repeatPasswordHandler} value={repeatPassword} className="e-input" type="password" placeholder="RepeatPassword" />
                            </div>
                            <div className={classes.SavePassword}>
                                <IconWithTooltip position="top" tooltip="Save Password">
                                    <button onClick={() => modeHandler("Passwords")}><i className="fa-regular fa-floppy-disk"></i></button>
                                </IconWithTooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;