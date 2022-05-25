import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import agent from "../../api/agent";
import healthcare from "../reducers/healthcare";
import { AppointmentAction, RehabilitatorAppointment, SET_ALL_APPOINTMENTS, SET_APPOINTMENT_ERROR, SET_APPOINTMENT_LOADING, SET_APPOINTMENT_SUCCESS, SET_EXISTING_PROCEDURES, SET_PERSONAL_SCHEDULE, SET_SCHEDULE } from "../types";

export const setAppointmentSuccess = (value: string): ThunkAction<void, RootState, null, AppointmentAction> => {
    return dispatch => {
        dispatch({
            type: SET_APPOINTMENT_SUCCESS,
            payload: value
        });
    }
}

export const setAppointmentError = (value: string): ThunkAction<void, RootState, null, AppointmentAction> => {
    return dispatch => {
        dispatch({
            type: SET_APPOINTMENT_ERROR,
            payload: value
        });
    }
}

export const setAppointmentLoading = (value: boolean): ThunkAction<void, RootState, null, AppointmentAction> => {
    return dispatch => {
        dispatch({
            type: SET_APPOINTMENT_LOADING,
            payload: value
        });
    }
}

export const booktherapistappointment = (token: any, professional: string, information: string, startTime: Date, endTime: Date): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        dispatch(setAppointmentLoading(true));

        const booking = await agent.appointments.createTherapist(professional, information, startTime, endTime, token).catch(err => {
            console.log(err.response.data.message)
            dispatch(setAppointmentError(err.response.data.message))
            dispatch(setAppointmentLoading(false));
        })

        if (booking) {
            dispatch({
                type: SET_APPOINTMENT_SUCCESS,
                payload: "success"
            })
        }
        dispatch(setAppointmentLoading(false));
    }
}

export const bookrehabilitatorappointments = (token: any, professional: string, healthcareID: string, items: RehabilitatorAppointment[]): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));
            console.log(items)

            const booking = await agent.appointments.createRehabilitator(professional, items, healthcareID, token).catch(err => {
                console.log(err.response.data.message)
                dispatch(setAppointmentError(err.response.data.message))
                dispatch(setAppointmentLoading(false));
            })

            console.log(booking)
            if (booking) {
                dispatch({
                    type: SET_APPOINTMENT_SUCCESS,
                    payload: "success"
                })
            }

            dispatch(setAppointmentLoading(false));

        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }
    }
}

export const getexistingprocedures = (token: any): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            const procedures = await agent.appointments.listPersonal(token)

            if (Array.isArray(procedures)) {
                dispatch({
                    type: SET_EXISTING_PROCEDURES,
                    payload: procedures
                })
            }

            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const getallappointments = (token: any): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            const procedures = await agent.appointments.list(token)

            if (procedures) {
                dispatch({
                    type: SET_ALL_APPOINTMENTS,
                    payload: procedures
                });
            }

            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const acceptappointment = (appointmentID: string, token: any): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            const procedures = await agent.appointments.accept(appointmentID, token)

            if (procedures) {
                dispatch({
                    type: SET_ALL_APPOINTMENTS,
                    payload: procedures
                })
            }

            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const declineappointment = (appointmentID: string, token: any): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            const procedures = await agent.appointments.decline(appointmentID, token)

            if (procedures) {
                dispatch({
                    type: SET_ALL_APPOINTMENTS,
                    payload: procedures
                })
            }

            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const getschedule = (professional: string, token: any, mode: "Therapist" | "Rehabilitator"): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            if (mode == "Therapist") {
                const schedule = await agent.schedule.therapistSchedule(professional, token)
                if (schedule && schedule != "No appointments found") {
                    dispatch({
                        type: SET_SCHEDULE,
                        payload: schedule
                    })
                }

                dispatch(setAppointmentLoading(false));
            } else {
                const schedule = await agent.schedule.rehabilitatorSchedule(professional, token)
                if (schedule && schedule != "No appointments found") {
                    dispatch({
                        type: SET_SCHEDULE,
                        payload: schedule
                    })
                }

                dispatch(setAppointmentLoading(false));
            }

            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const emptyschedule = (): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            dispatch({
                type: SET_SCHEDULE,
                payload: null
            })


            dispatch(setAppointmentLoading(false));
        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const cancelappointment = (id: string, token: any): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        try {
            dispatch(setAppointmentLoading(true));

            const appointmentToDelete = await agent.appointments.cancelAppointment(id, token)

            if (appointmentToDelete) {
                dispatch({
                    type: SET_SCHEDULE,
                    payload: null
                })
                dispatch({
                    type: SET_APPOINTMENT_SUCCESS,
                    payload: "success_cancel"
                })
            }
            dispatch(setAppointmentLoading(false));

        } catch (err) {
            dispatch(setAppointmentLoading(false));
            console.log((err as any).message)
            dispatch(setAppointmentError((err as any).message))
        }

    }
}

export const getpersonalschedule = (token: string, userType: string): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {

        dispatch(setAppointmentLoading(true));

        if (userType == "Rehabilitator") {
            const personalSchedule = await agent.schedule.personalScheduleRehabilitator(token).catch(err => {
                setAppointmentError(err.response.data.message)
                dispatch(setAppointmentLoading(false));
            })

            if (personalSchedule.length > 0) {
                dispatch({
                    type: SET_PERSONAL_SCHEDULE,
                    payload: personalSchedule
                })
            }
        }
        if (userType == "Therapist") {
            const personalSchedule = await agent.schedule.personalScheduleTherapist(token).catch(err => {
                setAppointmentError(err.response.data.message)
                dispatch(setAppointmentLoading(false));
            })

            if (personalSchedule.length > 0) {
                dispatch({
                    type: SET_PERSONAL_SCHEDULE,
                    payload: personalSchedule
                })
            }
        }
    }
}

export const emptyPersonalSchedule = (): ThunkAction<void, RootState, null, AppointmentAction> => {
    return async dispatch => {
        dispatch({
            type: SET_PERSONAL_SCHEDULE,
            payload: null
        })

    }
}