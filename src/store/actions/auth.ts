import { createUserWithEmailAndPassword, getAuth, getIdTokenResult, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ThunkAction } from "redux-thunk";
import { RootState } from "..";

import { AuthAction, SET_ERROR, SET_LOADING, SET_SUCCESS, SET_USER, SIGN_OUT } from "../types";
import agent from '../../api/agent';
import { auth } from "../../firebase";

export const register = (email: string, forename: string, surname: string, password: string): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        dispatch(setLoading(true));
        const authenticator = auth;
        await createUserWithEmailAndPassword(authenticator, email, password).then(async res => {
            if (res.user) {
                const token = await res.user.getIdToken(true)
                const createdUser = await agent.user.create(res.user.uid, email, forename, surname, token)
                if (createdUser) {
                    dispatch({
                        type: SET_USER,
                        payload1: createdUser,
                        payload2: true,
                        payload3: createdUser.type,
                        payload4: token
                    })
                }
            }
            dispatch(setLoading(false));
        }).catch(err => {
            let errorCode = err.code.split("auth/")[1]
            dispatch(setError(errorCode.replace(/-/g, ' ')))
            dispatch(setLoading(false));
        })

        dispatch(setLoading(false));
    }
}

export const login = (email: string, password: string): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        dispatch(setLoading(true));
        const authenticator = auth;
        await signInWithEmailAndPassword(authenticator, email, password).then(res => {
            dispatch(setLoading(false));
            if (res)
                dispatch(setSuccess("Login successfull."))
        }).catch(err => {
            let errorCode = err.code.split("auth/")[1]
            dispatch(setError(errorCode.replace(/-/g, ' ')))
            dispatch(setLoading(false));
        })
        dispatch(setLoading(false));

    }
}

export const getuserbyid = (user: any): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            dispatch(setLoading(true));
            const token = await user.getIdToken(true)
            const getUser = await agent.user.details(token);

            if (getUser) {
                dispatch({
                    type: SET_USER,
                    payload1: getUser,
                    payload2: true,
                    payload3: getUser.type,
                    payload4: token
                })
            }
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setLoading(false));
            console.log((err as any).message)
            dispatch(setError((err as any).message))
        }
    }
}

export const logout = (): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        try {
            dispatch(setLoading(true));
            const authenticator = auth
            await signOut(authenticator)
            dispatch({
                type: SIGN_OUT
            });
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setLoading(false));
            console.log((err as any).message)
            dispatch(setError((err as any).message))
        }
    }
}

export const setLoading = (value: boolean): ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type: SET_LOADING,
            payload: value
        });
    }
}

export const setError = (msg: string): ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type: SET_ERROR,
            payload: msg
        });
    }
}

export const setSuccess = (msg: string): ThunkAction<void, RootState, null, AuthAction> => {
    return dispatch => {
        dispatch({
            type: SET_SUCCESS,
            payload: msg
        });
    }
}

export const forgotpassword = (email: string): ThunkAction<void, RootState, null, AuthAction> => {
    return async dispatch => {
        dispatch(setLoading(true));

        const auth = getAuth();
        sendPasswordResetEmail(auth, email).then((res) => {
            dispatch(setSuccess("A reset email has been successfully sent."))
        }).catch(err => {
            let errorCode = err.code.split("auth/")[1]
            dispatch(setError(errorCode.replace(/-/g, ' ')))
            dispatch(setLoading(false));
        })
        dispatch(setLoading(false));

    }
}