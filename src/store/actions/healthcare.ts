import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import agent from "../../api/agent";
import { AppointmentT, Docs, Healthcare, HealthcareAction, SET_HEALTHCARE, SET_HEALTHCARE_APPOINTMENT, SET_HEALTHCARE_ERROR, SET_HEALTHCARE_LOADING, SET_HEALTHCARE_SUCCESS, SET_LIST_HEALTHCARES } from "../types";

export const setHealthcareLoading = (value: boolean): ThunkAction<void, RootState, null, HealthcareAction> => {
    return dispatch => {
        dispatch({
            type: SET_HEALTHCARE_LOADING,
            payload: value
        });
    }
}

export const setHealthcareError = (msg: string): ThunkAction<void, RootState, null, HealthcareAction> => {
    return dispatch => {
        dispatch({
            type: SET_HEALTHCARE_ERROR,
            payload: msg
        });
    }
}

export const setHealthcareSuccess = (msg: string): ThunkAction<void, RootState, null, HealthcareAction> => {
    return dispatch => {
        dispatch({
            type: SET_HEALTHCARE_SUCCESS,
            payload: msg
        });
    }
}


export const sethealthcareappointment = (id: string, token: any): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {
        try {
            dispatch(setHealthcareLoading(true))

            const appointment = await agent.appointments.detailsTherapist(id, token)

            if (appointment) {
                dispatch({
                    type: SET_HEALTHCARE_APPOINTMENT,
                    payload: appointment
                })
            }
            dispatch(setHealthcareLoading(false))
        } catch (err) {
            dispatch(setHealthcareError((err as any).message))
            console.log((err as any).message)
        }
    }
}

export const createhealthcare = (appointment: string, diagnosis: string, appointmentsRehabRequired: number, requirements: string[], token: any, documents?: File[], fileDetails?: string[]): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        if (documents && fileDetails)
            if (documents.length > 0 && fileDetails.length > 0 && documents.length == fileDetails.length) {
                const formData = new FormData();
                if (documents) {
                    for (let i = 0; i < documents.length; i++) {
                        formData.append("file", documents[i])
                    }
                }

                const uploadedFileNames = await agent.files.professionalUpload(token, formData)
                if (uploadedFileNames && fileDetails) {
                    let fileNamesWithDetails: Docs[] = [];
                    for (let i = 0; i < uploadedFileNames.length; i++) {
                        fileNamesWithDetails.push({ name: uploadedFileNames[i], information: fileDetails[i] })
                    }
                    const healthcare = await agent.healthcare.create(token, appointment, diagnosis, appointmentsRehabRequired, requirements, fileNamesWithDetails).catch(err => {
                        dispatch(setHealthcareError(err.response.data.message))
                        dispatch(setHealthcareLoading(false));
                    })
                    if (healthcare) {
                        dispatch({
                            type: SET_HEALTHCARE_SUCCESS,
                            payload: "creation_success"
                        })
                    }
                }
            }
            else {
                let fileNamesWithDetails: Docs[] = [];
                const healthcare = await agent.healthcare.create(token, appointment, diagnosis, appointmentsRehabRequired, requirements, fileNamesWithDetails).catch(err => {
                    dispatch(setHealthcareError(err.response.data.message))
                })
                if (healthcare) {
                    dispatch({
                        type: SET_HEALTHCARE_SUCCESS,
                        payload: "creation_success"
                    })
                }
            }

        dispatch(setHealthcareLoading(false))

    }
}

export const gethealthcare = (id: string, token: any): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {
        try {
            dispatch(setHealthcareLoading(true))

            const healthcare = await agent.healthcare.details(token, id)
            if (healthcare) {
                let docNames: string[] = [];
                for (let i = 0; i < healthcare.documents.length; i++) {
                    docNames.push(healthcare.documents[i].name)
                }
                if (docNames.length == 0) {
                    docNames = [];
                }

                let downloadedDocLinks: string[] = [];
                if (docNames.length > 0) {
                    const docLinks = await agent.files.downloadProfessional("Professional", docNames, token)
                    downloadedDocLinks = docLinks
                }

                let clientDocNames: string[] = [];
                for (let i = 0; i < healthcare.clientDocs.length; i++) {
                    clientDocNames.push(healthcare.clientDocs[i].name)
                }

                let downloadedClientDocLinks: string[] = []
                if (clientDocNames.length > 0) {
                    const clientDocLinks = await agent.files.downloadClient("Client", clientDocNames, token)
                    downloadedClientDocLinks = clientDocLinks
                }

                dispatch({
                    type: SET_HEALTHCARE,
                    payload: healthcare,
                    payload2: downloadedDocLinks,
                    payload3: downloadedClientDocLinks,
                })
            }
            dispatch(setHealthcareLoading(false))
        } catch (err) {
            dispatch(setHealthcareLoading(false))
            dispatch(setHealthcareError((err as any).message))
            console.log((err as any).message)
        }
    }
}

export const clearhealthcare = (): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {
        try {
            dispatch(setHealthcareLoading(true))

            dispatch({
                type: SET_HEALTHCARE,
                payload: null,
                payload2: null,
                payload3: null
            })
            dispatch(setHealthcareLoading(false))
        } catch (err) {
            dispatch(setHealthcareLoading(false))
            dispatch(setHealthcareError((err as any).message))
            console.log((err as any).message)
        }
    }
}


export const clientHealthcareUpload = (healthcareID: string, token: any, documents: File[], fileDetails: string[]): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {
        dispatch(setHealthcareLoading(true))

        if (documents.length > 0 && fileDetails.length > 0 && documents.length == fileDetails.length) {

            const formData = new FormData();
            if (documents)
                for (let i = 0; i < documents.length; i++) {
                    formData.append("file", documents[i])
                }

            const uploadedFileNames = await agent.files.clientUpload(token, formData, healthcareID).catch(err => {
                dispatch(setHealthcareError(err.response.data.message))
                        dispatch(setHealthcareLoading(false));
            })
            if (uploadedFileNames && fileDetails) {
                let fileNamesWithDetails: Docs[] = [];
                for (let i = 0; i < uploadedFileNames.length; i++) {
                    fileNamesWithDetails.push({ name: uploadedFileNames[i], information: fileDetails[i] })
                }
                const uploadedHealthcareFiles = await agent.healthcare.clientFileUpload(token, healthcareID, fileNamesWithDetails).catch(err => {
                    if (err) {
                        dispatch(setHealthcareError(err.response.data.message))
                        dispatch(setHealthcareLoading(false));
                    }
                })

                if (uploadedHealthcareFiles) {
                    dispatch({
                        type: SET_HEALTHCARE_SUCCESS,
                        payload: "success"
                    })
                }
            }

            dispatch(setHealthcareLoading(false))
        }
        dispatch({
            type: SET_HEALTHCARE_SUCCESS,
            payload: "success"
        })
        dispatch(setHealthcareLoading(false))

    }
}

export const listhealthcares = (token: any): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        const healthcares = await agent.healthcare.list(token).catch(err => {
            dispatch(setHealthcareError(err.response.data.message))
            dispatch(setHealthcareLoading(false))
        })

        if (healthcares) {
            dispatch({
                type: SET_LIST_HEALTHCARES,
                payload: healthcares
            })
            dispatch(setHealthcareSuccess("success"))
        }
        dispatch(setHealthcareLoading(false))

    }
}

export const emptyhealthcares = (): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        dispatch({
            type: SET_LIST_HEALTHCARES,
            payload: null
        })
        dispatch(setHealthcareSuccess("success"))
        dispatch(setHealthcareLoading(false))

    }
}

export const updatehealthcare = (id: string, token: any, mode: "documents" | "requirements" | "mixed", requirements: string[], documents: File[], fileDetails: string[]): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        if (documents && fileDetails)
            if (documents.length > 0 && fileDetails.length > 0) {
                const formData = new FormData();
                if (documents) {
                    for (let i = 0; i < documents.length; i++) {
                        formData.append("file", documents[i])
                    }
                }

                const uploadedFileNames = await agent.files.professionalUpload(token, formData)

                if (uploadedFileNames && fileDetails) {
                    let fileNamesWithDetails: Docs[] = [];
                    for (let i = 0; i < uploadedFileNames.length; i++) {
                        fileNamesWithDetails.push({ name: uploadedFileNames[i], information: fileDetails[i] })
                    }
                    const healthcare = await agent.healthcare.update(id, token, mode, requirements, fileNamesWithDetails).catch(err => {
                        dispatch(setHealthcareError(err.response.data.message))
                        dispatch(setHealthcareLoading(false))
                    })
                    if (healthcare) {
                        dispatch({
                            type: SET_HEALTHCARE_SUCCESS,
                            payload: "success_update"
                        })
                    }
                }
                dispatch(setHealthcareLoading(false))

            } else {
                const healthcare = await agent.healthcare.update(id, token, mode, requirements, []).catch(err => {
                    dispatch(setHealthcareError(err.response.data.message))
                    dispatch(setHealthcareLoading(false))
                })
                if (healthcare) {
                    dispatch({
                        type: SET_HEALTHCARE_SUCCESS,
                        payload: "success_update"
                    })
                }
            }

        dispatch(setHealthcareLoading(false))
    }
}

export const closehealthcare = (token: any, healthcareID: string): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        const closeHealthcare = await agent.healthcare.close(healthcareID, token).catch(err => {
            dispatch(setHealthcareError(err.response.data.message))
        })

        if (closeHealthcare) {
            dispatch({
                type: SET_HEALTHCARE_SUCCESS,
                payload: "Healthcare is now complete"
            })
        }

        dispatch(setHealthcareLoading(false))

    }
}

export const seenhealthcare = (token: any, healthcareID: string): ThunkAction<void, RootState, null, HealthcareAction> => {
    return async dispatch => {

        dispatch(setHealthcareLoading(true))

        const closeHealthcare = await agent.healthcare.seen(healthcareID, token).catch(err => {
            dispatch(setHealthcareError(err.response.data.message))
        })

        if (closeHealthcare) {
            dispatch({
                type: SET_HEALTHCARE_SUCCESS,
                payload: "Healthcare confirmed as seen"
            })
        }

        dispatch(setHealthcareLoading(false))

    }
}