//Authentication actions
export const SET_USER = "SET_USER";
export const SIGN_OUT = 'SIGN_OUT';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_SUCCESS = 'SET_SUCCESS';
export const SET_AUTH_MESSAGE_CHECK = 'SET_AUTH_MESSAGE_CHECK';

//Appointment actions
export const SET_APPOINTMENT_SUCCESS = 'SET_APPOINTMENT_SUCCESS';
export const SET_APPOINTMENT_ERROR = 'SET_APPOINTMENT_ERROR';
export const SET_APPOINTMENT_LOADING = 'SET_APPOINTMENT_LOADING';
export const SET_EXISTING_PROCEDURES = 'SET_EXISTING_PROCEDURES';
export const SET_ALL_APPOINTMENTS = 'SET_ALL_APPOINTMENTS';
export const SET_SCHEDULE = 'SET_SCHEDULE';
export const SET_PERSONAL_SCHEDULE = 'SET_PERSONAL_SCHEDULE';

//Healthcare actions
export const SET_HEALTHCARE_ERROR = 'SET_HEALTHCARE_ERROR';
export const SET_HEALTHCARE_SUCCESS = 'SET_HEALTHCARE_SUCCESS';
export const SET_HEALTHCARE_LOADING = 'SET_HEALTHCARE_LOADING';
export const SET_PERSONAL_HEALTHCARES = 'SET_PERSONAL_HEALTHCARES';
export const SET_HEALTHCARE_APPOINTMENT = 'SET_HEALTHCARE_APPOINTMENT';
export const SET_HEALTHCARE = 'SET_HEALTHCARE';
export const SET_LIST_HEALTHCARES = 'SET_LIST_HEALTHCARES';

export interface AuthState {
    user: User | null;
    authenticated: boolean;
    loading: boolean;
    error: string;
    successAuth: string;
    authChecked: boolean;
    userType: string;
    authToken: any;
}

export interface AppointmentState {
    success: string;
    error: string;
    loading: boolean;
    existingProcedures: any[] | null;
    allAppointments: any[] | null;
    schedule: TakenAppointment[] | null;
    personalSchedule: TakenAppointment[] | null
}

export interface HealthcareState {
    personalHealthcares: Healthcare[] | null;
    success: string;
    error: string;
    loading: boolean;
    healthcareAppointment: AppointmentT | null;
    healthcare: Healthcare | null;
    docLinks:string[] | null;
    clientDocLinks: string[] | null;
    healthcareList: Healthcare[] | null;
}

interface setUser {
    type: typeof SET_USER;
    payload1: null | User;
    payload2: boolean;
    payload3: string;
    payload4: any | null;
}

interface setLoading {
    type: typeof SET_LOADING;
    payload: boolean;
}

interface signOut {
    type: typeof SIGN_OUT;
}

interface setError {
    type: typeof SET_ERROR;
    payload: string;
}

interface setSuccess {
    type: typeof SET_SUCCESS;
    payload: string;
}

interface setAuthMessageCheck {
    type: typeof SET_AUTH_MESSAGE_CHECK,
    payload: boolean;
}

export type AuthAction =
    setUser |
    setLoading |
    signOut |
    setError |
    setSuccess |
    setAuthMessageCheck;

interface setAppointmentSuccess {
    type: typeof SET_APPOINTMENT_SUCCESS,
    payload: string
}

interface setAppointmentError {
    type: typeof SET_APPOINTMENT_ERROR,
    payload: string
}

interface setAppointmentLoading {
    type: typeof SET_APPOINTMENT_LOADING,
    payload: boolean
}

interface setExistingProcedures {
    type: typeof SET_EXISTING_PROCEDURES,
    payload: any[]
}

interface setAllAppointments {
    type: typeof SET_ALL_APPOINTMENTS,
    payload: any[]
}

interface setSchedule {
    type: typeof SET_SCHEDULE,
    payload: TakenAppointment[] | null
}

interface setPersonalSchedule {
    type: typeof SET_PERSONAL_SCHEDULE,
    payload: TakenAppointment[] | null
}

export type AppointmentAction =
    setAppointmentSuccess |
    setAppointmentError |
    setAppointmentLoading |
    setExistingProcedures |
    setAllAppointments |
    setSchedule |
    setPersonalSchedule;

interface setHealthcareLoading {
    type: typeof SET_HEALTHCARE_LOADING,
    payload: boolean
}

interface setHealthcareSuccess {
    type: typeof SET_HEALTHCARE_SUCCESS,
    payload: string
}

interface setHealthcareError {
    type: typeof SET_HEALTHCARE_ERROR,
    payload: string
}

interface setHealthcareAppointment {
    type: typeof SET_HEALTHCARE_APPOINTMENT,
    payload: AppointmentT
}

interface setHealthcare {
    type: typeof SET_HEALTHCARE,
    payload: Healthcare | null,
    payload2: string[] | null,
    payload3: string[] | null
}

interface setHealthcareList {
    type: typeof SET_LIST_HEALTHCARES,
    payload: Healthcare[] | null,
}
export type HealthcareAction =
    setHealthcareLoading |
    setHealthcareError |
    setHealthcareSuccess |
    setHealthcareAppointment |
    setHealthcare |
    setHealthcareList;

export interface User {
    id: string;
    email: string;
    forename: string;
    surname: string;
    type: string;
    avatar: string;
    mobile: number;
    healthcare: Healthcare[];
    appointments: AppointmentT[];
}

export interface Rehab {
    title: string;
    avatar: string;
}

export interface Healthcare {
    _id: string;
    client: string;
    diagnosis: string;
    complete: boolean,
    information: string;
    approved: boolean;
    therapist: string;
    rehabilitator: string;
    appointmentTherapist: AppointmentT;
    appointmentsRehabilitator: RehabilitatorAppointment[];
    appointmentsRehabRequired: number;
    documents: Docs[];
    clientDocs: Docs[];
    requirements: string[];
    therapistRequirement: boolean;
    initialisationDate: Date;
}

export interface Docs {
    name: string,
    information: string,
}

export interface AppointmentT {
    _id: string;
    client: string;
    StartTime: Date;
    EndTime: Date;
    information: string;
    professional: string;
    status: string;
    complete: boolean
    date: Date;
}

export interface TakenAppointment {
    id: string,
    Subject: string,
    IsBlock: boolean,
    StartTime: Date,
    EndTime: Date,
}

export interface RehabilitatorAppointment {
    _id: string,
    Subject: string,
    IsBlock:boolean,
    StartTime: Date,
    EndTime: Date,
    professional: string,
}

export interface ClientFileUpload {
    token: string,
    healthcareID: string
}