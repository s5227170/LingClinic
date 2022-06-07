import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../components/interface/FormInput/FormInput';
import { RootState } from '../../store';
import { forgotpassword, login, register, setError, setSuccess } from '../../store/actions/auth';
import { v4 as uuid } from 'uuid'

import classes from './Authentication.module.css';
import BackgroundEffect from '../../components/HOC/BackroundEffect/BackgroundEffect';
import ErrorModal from '../../components/interface/ErrorModal/ErrorModal';

const Authenticate: FC = () => {
    const dispatch = useDispatch();
    const { error, successAuth } = useSelector((state: RootState) => state.auth);

    const [emailLogin, setEmailLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")

    const [emailRegister, setEmailRegister] = useState("")
    const [forenameRegister, setForenameRegister] = useState("")
    const [surnameRegister, setSurnameRegister] = useState("")
    const [passwordRegister, setPasswordRegister] = useState("")
    const [passwordRepeatRegister, setPasswordRepeatRegister] = useState("")

    const [emailForgotPassword, setEmailForgotPassword] = useState("")

    const [authErrorMode, setAuthErrorMode] = useState("none")
    const [authError, setAuthError] = useState<string[]>([])

    //Login
    const emailLoginHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailLogin(e.currentTarget.value)
    }

    const passwordLoginHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordLogin(e.currentTarget.value)
    }

    //Register
    const emailRegisterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailRegister(e.currentTarget.value)
    }

    const forenameRegisterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setForenameRegister(e.currentTarget.value)
    }

    const surnameRegisterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSurnameRegister(e.currentTarget.value)
    }

    const passwordRegisterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordRegister(e.currentTarget.value)
    }

    const passwordRepeatRegisterHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeatRegister(e.currentTarget.value)
    }

    //Forgot Password
    const emailForgotPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailForgotPassword(e.currentTarget.value)
    }

    //Submission Handlers
    const loginHandler = () => {
        setAuthError([])
        let errors = false;
        setAuthErrorMode("register")
        if (emailLogin == "") {
            setAuthError(authError => [...authError, "Please enter an email."])
            errors = true;
        }
        if (passwordLogin == "") {
            setAuthError(authError => [...authError, "Please enter a password."])
            errors = true;
        }

        if (!errors) {
            dispatch(login(emailLogin, passwordLogin))
        } else {
            return
        }
    }

    const registerHandler = () => {
        setAuthError([])
        let errors = false;
        setAuthErrorMode("register")
        if (emailRegister == "") {
            setAuthError(authError => [...authError, "Please enter an email."])
            errors = true;
        }
        if (forenameRegister == "") {
            setAuthError(authError => [...authError, "Please enter a forename."])
            errors = true;
        }
        if (surnameRegister == "") {
            setAuthError(authError => [...authError, "Please enter a surname."])
            errors = true;
        }
        if (passwordRegister == "") {
            setAuthError(authError => [...authError, "Please enter a password."])
            errors = true;
        }
        if (passwordRegister != passwordRepeatRegister) {
            setAuthError(authError => [...authError, "Passwords do not match."])
            errors = true;
        }
        if (!errors) {
            dispatch(register(emailRegister, forenameRegister, surnameRegister, passwordRegister));
        } else {
            return
        }
    }

    const forgotPasswordHandler = () => {
        dispatch(forgotpassword(emailForgotPassword))
    }

    const dropModalHandler = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            dispatch(setError(""))
            dispatch(setSuccess(""))
        }
    }

    return (
        <div className={classes.Wrapper}>
            <BackgroundEffect />
            <BackgroundEffect />
            {error.length > 0 ?
                <ErrorModal message={error} width={"40%"} height={"auto"} className={classes.CompletionModalWrapper} onClick={dropModalHandler} backdropOnClick={dropModalHandler} />
                :
                null}
            <div className={classes.AuthenticateMessage}>
                <h2>Login or Register in order to gain access to the available features</h2>
            </div>
            <div className={classes.Authenticate}>
                <div className={classes.Login}>
                    <div className={classes.LoginInfo}>
                        <h2>Log In</h2>
                        <hr></hr>
                        <label className={classes.Info}>Have an existing account? Sign in using this form.</label>
                        {(authErrorMode == "login" && authError.length > 0) ? authError.map(item => {
                            return (<h5 key={uuid()} className={classes.Error}>{item}</h5>)
                        }) : null}
                        {error == "Firebase: Error (auth/user-not-found)." ? <h5 key={uuid()} className={classes.Error}>Wrong password or unexisting user</h5> : null}
                        <div className={classes.Inputs}>
                            <FormInput label="Email" type="email" placeholder="Enter email" value={emailLogin} onChange={emailLoginHandler} />
                            <FormInput label="Password" type="password" placeholder="Enter password" value={passwordLogin} onChange={passwordLoginHandler} />
                        </div>
                    </div>
                    <div className={classes.Submit}>
                        <button onClick={loginHandler} >Submit</button>
                    </div>
                </div>
                <h1 className={classes.Or}>OR</h1>
                <div className={classes.Register}>
                    <div className={classes.RegisterInfo}>
                        <h2>Register</h2>
                        <hr></hr>
                        <label className={classes.Info}>Don't have an account? Create one with this form.</label>
                        {(authErrorMode == "register" && authError.length > 0) ? authError.map(item => {
                            return (<h5 key={uuid()} className={classes.Error}>{item}</h5>)
                        }) : null}
                        {error == "Firebase: Error (auth/email-already-in-use)." ? <h5 key={uuid()} className={classes.Error}>User already exists with this email</h5> : null}
                        <div className={classes.Inputs}>
                            <FormInput label="Email" type="email" placeholder="Enter email" value={emailRegister} onChange={emailRegisterHandler} />
                            <FormInput label="Forename" type="text" placeholder="Enter your forename" value={forenameRegister} onChange={forenameRegisterHandler} />
                            <FormInput label="Surname" type="text" placeholder="Enter your surname" value={surnameRegister} onChange={surnameRegisterHandler} />
                            <FormInput label="Password" type="password" placeholder="Enter password" value={passwordRegister} onChange={passwordRegisterHandler} />
                            <FormInput label="Repeat Password" type="password" placeholder="Repeat password" value={passwordRepeatRegister} onChange={passwordRepeatRegisterHandler} />
                        </div>
                    </div>
                    <div className={classes.Submit}>
                        <button onClick={registerHandler}>Submit</button>
                    </div>
                </div>
            </div>
            <div className={classes.ForgotPasswordWrapper}>
                <div className={classes.ForgotPassword}>
                    <h2>Forgot Password</h2>
                    <hr></hr>
                    <label className={classes.Info}>Forgot your password? Enter your email and we will send you a password recovery <link rel="stylesheet" href="" className="" /></label>
                    {(authErrorMode == "login" && authError.length > 0) ? authError.map(item => {
                        return (<h5 key={uuid()} className={classes.Error}>{item}</h5>)
                    }) : null}
                    <FormInput label="Email" type="email" placeholder="Enter email" value={emailForgotPassword} onChange={emailForgotPasswordHandler} />
                    <div className={classes.Submit}>
                        <button onClick={forgotPasswordHandler}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Authenticate;