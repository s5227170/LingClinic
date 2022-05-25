import { AppointmentAction, AppointmentState, SET_ALL_APPOINTMENTS, SET_APPOINTMENT_ERROR, SET_APPOINTMENT_LOADING, SET_APPOINTMENT_SUCCESS, SET_EXISTING_PROCEDURES, SET_PERSONAL_SCHEDULE, SET_SCHEDULE } from "../types"


const initialState: AppointmentState = {
    success: "",
    error: "",
    loading: false,
    existingProcedures: null,
    allAppointments: null,
    schedule: null,
    personalSchedule: null,
}

export default (state = initialState, action: AppointmentAction) => {
    switch (action.type) {
        case SET_APPOINTMENT_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case SET_APPOINTMENT_SUCCESS:
            return {
                ...state,
                success: action.payload
            }
        case SET_APPOINTMENT_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case SET_EXISTING_PROCEDURES:
            return {
                ...state,
                existingProcedures: action.payload
            }
        case SET_ALL_APPOINTMENTS:
            return {
                ...state,
                allAppointments: action.payload
            }
        case SET_SCHEDULE:
            return {
                ...state,
                schedule: action.payload,
                loading: false
            }
        case SET_PERSONAL_SCHEDULE:
            return {
                ...state,
                personalSchedule: action.payload
            }
        default:
            return state;
    }
}