import { HealthcareAction, HealthcareState, SET_HEALTHCARE, SET_HEALTHCARE_APPOINTMENT, SET_HEALTHCARE_ERROR, SET_HEALTHCARE_LOADING, SET_HEALTHCARE_SUCCESS, SET_LIST_HEALTHCARES, SET_PERSONAL_HEALTHCARES } from "../types";


const initialState: HealthcareState = {
    success: "",
    error: "",
    loading: false,
    personalHealthcares: null,
    healthcareAppointment: null,
    healthcare: null,
    docLinks: null,
    clientDocLinks: null,
    healthcareList: null,
}

export default (state = initialState, action: HealthcareAction) => {
    switch (action.type) {
        case SET_HEALTHCARE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case SET_HEALTHCARE_SUCCESS:
            return {
                ...state,
                success: action.payload,
                loading: false
            }
        case SET_HEALTHCARE_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case SET_HEALTHCARE_APPOINTMENT:
            return {
                ...state,
                healthcareAppointment: action.payload,
                loading: false
            }
        case SET_HEALTHCARE:
            return {
                ...state,
                healthcare: action.payload,
                docLinks: action.payload2,
                clientDocLinks: action.payload3
            }
        case SET_LIST_HEALTHCARES:
        return {
            ...state,
            healthcareList: action.payload
        }
        default:
            return state;
    }
}