import axios, { AxiosResponse } from "axios";
import { AppointmentT, ClientFileUpload, Docs, RehabilitatorAppointment } from "../store/types";

const responseBody = (response: AxiosResponse) => response.data;

axios.defaults.withCredentials = true
const requests = {
    get: (url: string, body: {}, token: string) => axios.get(url, { params: body, headers: { "Authorization": "Bearer " + token } }).then(responseBody),
    postFile: (url: string, body: {}, token: string) => axios.post(url, body, {headers: { "Authorization": "Bearer " + token } }).then(responseBody),
    getFile: (url: string, body: {}, token: string) => axios.get(url, {params: body, headers: { "Authorization": "Bearer " + token } }).then(responseBody),
    post: (url: string, body: {}, token: string) => axios.post(url, body, { headers: { "Authorization": "Bearer " + token } }).then(responseBody),
    put: (url: string, body: {}, token: string) => axios.put(url, body, { headers: { "Authorization": "Bearer " + token } }).then(responseBody),
    del: (url: string, body, token: string) => axios.delete(url, {params: body, headers: { "Authorization": "Bearer " + token } }).then(responseBody),
};

const user = {
    details: (token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-users/getuser", {}, token),
    create: (uid: string, email: string, forename: string, surname: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-users/createuser", { uid, email, forename, surname }, token)
}

const files = {
    professionalUpload: ( token: string, documents: FormData) => requests.postFile("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-files/uploadTherapist", documents, token),
    clientUpload: (token: string, documents: FormData, healthcareID: string) => requests.postFile("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-files/uploadClient/" + healthcareID.toString(), documents , token),
    downloadProfessional: (mode: "Professional", docNames: string[], token: string ) => requests.getFile("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-files/downloadFile", {mode, docNames}, token),
    downloadClient: ( mode: "Client", docNames: string[], token: string ) => requests.getFile("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-files/downloadFile", {mode, docNames}, token),
}

const healthcare = {
    create: (token: string, appointment: string, diagnosis: string, appointmentsRehabRequired: number, requirements: string[], documents: Docs[]) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/createhealthcare", { appointment, diagnosis, appointmentsRehabRequired, requirements, documents }, token),
    details: (token: string, healthcareID: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/gethealthcare", {healthcareID}, token),
    list: (token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/listhealthcares", {}, token),
    clientFileUpload: (token: string, healthcareID: string, fileDocs: Docs[]) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/clienthealthcaredocuments", { healthcareID, fileDocs }, token),
    update: (healthcareID: string, token: string, mode: "documents" | "requirements" | "mixed", requirements: string[], fileDocs: Docs[]) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/healthcareupdate", { healthcareID, mode, requirements, fileDocs }, token),
    close: (healthcareID: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/completehealthcare", { healthcareID }, token),
    seen: (healthcareID: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-healthcares/confirmchanges", { healthcareID }, token),
}

const appointments = {
    detailsTherapist: (appointmentID: string, token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/getappointment", { appointmentID }, token),
    createTherapist: (professional: string, information: string, StartTime: Date, EndTime: Date, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/createappointmenttherapist", { professional, information, StartTime, EndTime }, token),
    createRehabilitator: (professional: string, items: RehabilitatorAppointment[], healthcareID: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/createappointmentsrehabilitator", { professional, items, healthcareID }, token),
    listPersonal: (token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/getpersonalactivity", {}, token),
    list: (token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/getappointments", {}, token),
    accept: (appointmentID: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/acceptappointmenttherapist", { appointmentID }, token),
    decline: (appointmentID: string, token: string) => requests.post("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/declineappointmenttherapist", { appointmentID }, token),
    cancelAppointment: (appointmentID: string, token: string) => requests.del("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-appointments/cancelappointment", { appointmentID }, token),
}

const schedule = {
    personalScheduleRehabilitator: (token:string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-schedules/getpersonalschedulerehabilitator", {}, token),
    personalScheduleTherapist: (token:string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-schedules/getpersonalscheduletherapist", {}, token),
    therapistSchedule: (therapistID: string, token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-schedules/gettherapistschedule", { therapistID }, token),
    rehabilitatorSchedule: (rehabilitatorID: string, token: string) => requests.get("https://europe-west2-final-year-project-82049.cloudfunctions.net/fyp-schedules/getrehabilitatorschedule", { rehabilitatorID }, token),
}

export default {
    user,
    appointments,
    healthcare,
    schedule,
    files
}