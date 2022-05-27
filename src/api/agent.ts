import axios, { AxiosResponse } from "axios";
import { Docs, RehabilitatorAppointment } from "../store/types";

const responseBody = (response: AxiosResponse) => response.data;

//Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost";
} else {
  axios.defaults.baseURL =
    "https://europe-west2-final-year-project-82049.cloudfunctions.net/";
}

const requests = {
  get: (url: string, body: {}, token: string) =>
    axios
      .get(url, { params: body, headers: { Authorization: "Bearer " + token } })
      .then(responseBody),
  postFile: (url: string, body: {}, token: string) =>
    axios
      .post(url, body, { headers: { Authorization: "Bearer " + token } })
      .then(responseBody),
  getFile: (url: string, body: {}, token: string) =>
    axios
      .get(url, { params: body, headers: { Authorization: "Bearer " + token } })
      .then(responseBody),
  post: (url: string, body: {}, token: string) =>
    axios
      .post(url, body, { headers: { Authorization: "Bearer " + token } })
      .then(responseBody),
  put: (url: string, body: {}, token: string) =>
    axios
      .put(url, body, { headers: { Authorization: "Bearer " + token } })
      .then(responseBody),
  del: (url: string, body, token: string) =>
    axios
      .delete(url, {
        params: body,
        headers: { Authorization: "Bearer " + token },
      })
      .then(responseBody),
};

//Setting the cloud function end-point name
let userEndPoint = "fyp-users/";

// //Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  userEndPoint = ":3001/";
}

const user = {
  details: (token: string) => requests.get(userEndPoint + "getuser", {}, token),
  create: (
    uid: string,
    email: string,
    forename: string,
    surname: string,
    token: string
  ) =>
    requests.post(
      userEndPoint + "createuser",
      { uid, email, forename, surname },
      token
    ),
};

//Setting the cloud function end-point name
let fileEndPoint = "fyp-files/";

//Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  fileEndPoint = ":3002/";
}

const files = {
  professionalUpload: (token: string, documents: FormData) =>
    requests.postFile(fileEndPoint + "uploadTherapist", documents, token),
  clientUpload: (token: string, documents: FormData, healthcareID: string) =>
    requests.postFile(
      fileEndPoint + "uploadClient/" + healthcareID.toString(),
      documents,
      token
    ),
  downloadProfessional: (
    mode: "Professional",
    docNames: string[],
    token: string
  ) =>
    requests.getFile(fileEndPoint + "downloadFile", { mode, docNames }, token),
  downloadClient: (mode: "Client", docNames: string[], token: string) =>
    requests.getFile(fileEndPoint + "downloadFile", { mode, docNames }, token),
};

//Setting the cloud function end-point name
let healthcareEndPoint = "fyp-healthcares/";

//Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  healthcareEndPoint = ":3003/";
}

const healthcare = {
  create: (
    token: string,
    appointment: string,
    diagnosis: string,
    appointmentsRehabRequired: number,
    requirements: string[],
    documents: Docs[]
  ) =>
    requests.post(
      healthcareEndPoint + "createhealthcare",
      {
        appointment,
        diagnosis,
        appointmentsRehabRequired,
        requirements,
        documents,
      },
      token
    ),
  details: (token: string, healthcareID: string) =>
    requests.get(healthcareEndPoint + "gethealthcare", { healthcareID }, token),
  list: (token: string) =>
    requests.get(healthcareEndPoint + "listhealthcares", {}, token),
  clientFileUpload: (token: string, healthcareID: string, fileDocs: Docs[]) =>
    requests.post(
      healthcareEndPoint + "clienthealthcaredocuments",
      { healthcareID, fileDocs },
      token
    ),
  update: (
    healthcareID: string,
    token: string,
    mode: "documents" | "requirements" | "mixed",
    requirements: string[],
    fileDocs: Docs[]
  ) =>
    requests.post(
      healthcareEndPoint + "healthcareupdate",
      { healthcareID, mode, requirements, fileDocs },
      token
    ),
  close: (healthcareID: string, token: string) =>
    requests.post(
      healthcareEndPoint + "completehealthcare",
      { healthcareID },
      token
    ),
  seen: (healthcareID: string, token: string) =>
    requests.post(
      healthcareEndPoint + "confirmchanges",
      { healthcareID },
      token
    ),
};

//Setting the cloud function end-point name
let appointmentsEndPoint = "fyp-appointments/";

//Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  appointmentsEndPoint = ":3004/";
}

const appointments = {
  detailsTherapist: (appointmentID: string, token: string) =>
    requests.get(
      appointmentsEndPoint + "getappointment",
      { appointmentID },
      token
    ),
  createTherapist: (
    professional: string,
    information: string,
    StartTime: Date,
    EndTime: Date,
    token: string
  ) =>
    requests.post(
      appointmentsEndPoint + "createappointmenttherapist",
      { professional, information, StartTime, EndTime },
      token
    ),
  createRehabilitator: (
    professional: string,
    items: RehabilitatorAppointment[],
    healthcareID: string,
    token: string
  ) =>
    requests.post(
      appointmentsEndPoint + "createappointmentsrehabilitator",
      { professional, items, healthcareID },
      token
    ),
  listPersonal: (token: string) =>
    requests.get(appointmentsEndPoint + "getpersonalactivity", {}, token),
  list: (token: string) =>
    requests.get(appointmentsEndPoint + "getappointments", {}, token),
  accept: (appointmentID: string, token: string) =>
    requests.post(
      appointmentsEndPoint + "acceptappointmenttherapist",
      { appointmentID },
      token
    ),
  decline: (appointmentID: string, token: string) =>
    requests.post(
      appointmentsEndPoint + "declineappointmenttherapist",
      { appointmentID },
      token
    ),
  cancelAppointment: (appointmentID: string, token: string) =>
    requests.del(
      appointmentsEndPoint + "cancelappointment",
      { appointmentID },
      token
    ),
};

//Setting the cloud function end-point name
let scheduleEndPoint = "fyp-schedules/";

//Checking the environement type if either development or production
if (process.env.NODE_ENV === "development") {
  scheduleEndPoint = ":3005/";
}

const schedule = {
  personalScheduleRehabilitator: (token: string) =>
    requests.get(
      scheduleEndPoint + "getpersonalschedulerehabilitator",
      {},
      token
    ),
  personalScheduleTherapist: (token: string) =>
    requests.get(scheduleEndPoint + "getpersonalscheduletherapist", {}, token),
  therapistSchedule: (therapistID: string, token: string) =>
    requests.get(
      scheduleEndPoint + "gettherapistschedule",
      { therapistID },
      token
    ),
  rehabilitatorSchedule: (rehabilitatorID: string, token: string) =>
    requests.get(
      scheduleEndPoint + "getrehabilitatorschedule",
      { rehabilitatorID },
      token
    ),
};

export default {
  user,
  appointments,
  healthcare,
  schedule,
  files,
};
