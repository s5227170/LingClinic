import axios, { AxiosResponse } from "axios";
import { Docs, RehabilitatorAppointment, User } from "../store/types";

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
  details: (token: string) =>
    requests.get(axios.defaults.baseURL + userEndPoint + "getuser", {}, token),
  create: (
    uid: string,
    email: string,
    forename: string,
    surname: string,
    token: string
  ) =>
    requests.post(
      axios.defaults.baseURL + userEndPoint + "createuser",
      { uid, email, forename, surname },
      token
    ),
  update: (user: User, token: string) =>
    requests.post(
      axios.defaults.baseURL + userEndPoint + "updateuser",
      { user },
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
    requests.postFile(
      axios.defaults.baseURL + fileEndPoint + "uploadTherapist",
      documents,
      token
    ),
  clientUpload: (token: string, documents: FormData, healthcareID: string) =>
    requests.postFile(
      axios.defaults.baseURL +
        fileEndPoint +
        "uploadClient/" +
        healthcareID.toString(),
      documents,
      token
    ),
  downloadProfessional: (
    mode: "Professional",
    docNames: string[],
    token: string
  ) =>
    requests.getFile(
      axios.defaults.baseURL + fileEndPoint + "downloadFile",
      { mode, docNames },
      token
    ),
  downloadClient: (mode: "Client", docNames: string[], token: string) =>
    requests.getFile(
      axios.defaults.baseURL + fileEndPoint + "downloadFile",
      { mode, docNames },
      token
    ),
  downloadAvatar: (avatar: string, token: string) =>
    requests.getFile(
      axios.defaults.baseURL + fileEndPoint + "downloadAvatar",
      { avatar },
      token
    ),
  uploadAvatar: (token: string, avatar: FormData) =>
    requests.postFile(
      axios.defaults.baseURL + fileEndPoint + "uploadAvatar",
      avatar,
      token
    ),
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
      axios.defaults.baseURL + healthcareEndPoint + "createhealthcare",
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
    requests.get(
      axios.defaults.baseURL + healthcareEndPoint + "gethealthcare",
      { healthcareID },
      token
    ),
  list: (token: string) =>
    requests.get(
      axios.defaults.baseURL + healthcareEndPoint + "listhealthcares",
      {},
      token
    ),
  clientFileUpload: (token: string, healthcareID: string, fileDocs: Docs[]) =>
    requests.post(
      axios.defaults.baseURL + healthcareEndPoint + "clienthealthcaredocuments",
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
      axios.defaults.baseURL + healthcareEndPoint + "healthcareupdate",
      { healthcareID, mode, requirements, fileDocs },
      token
    ),
  close: (healthcareID: string, token: string) =>
    requests.post(
      axios.defaults.baseURL + healthcareEndPoint + "completehealthcare",
      { healthcareID },
      token
    ),
  seen: (healthcareID: string, token: string) =>
    requests.post(
      axios.defaults.baseURL + healthcareEndPoint + "confirmchanges",
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
      axios.defaults.baseURL + appointmentsEndPoint + "getappointment",
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
      axios.defaults.baseURL +
        appointmentsEndPoint +
        "createappointmenttherapist",
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
      axios.defaults.baseURL +
        appointmentsEndPoint +
        "createappointmentsrehabilitator",
      { professional, items, healthcareID },
      token
    ),
  listPersonal: (token: string) =>
    requests.get(
      axios.defaults.baseURL + appointmentsEndPoint + "getpersonalactivity",
      {},
      token
    ),
  list: (token: string) =>
    requests.get(
      axios.defaults.baseURL + appointmentsEndPoint + "getappointments",
      {},
      token
    ),
  accept: (appointmentID: string, token: string) =>
    requests.post(
      axios.defaults.baseURL +
        appointmentsEndPoint +
        "acceptappointmenttherapist",
      { appointmentID },
      token
    ),
  decline: (appointmentID: string, token: string) =>
    requests.post(
      axios.defaults.baseURL +
        appointmentsEndPoint +
        "declineappointmenttherapist",
      { appointmentID },
      token
    ),
  cancelAppointment: (appointmentID: string, token: string) =>
    requests.del(
      axios.defaults.baseURL + appointmentsEndPoint + "cancelappointment",
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
      axios.defaults.baseURL +
        scheduleEndPoint +
        "getpersonalschedulerehabilitator",
      {},
      token
    ),
  personalScheduleTherapist: (token: string) =>
    requests.get(
      axios.defaults.baseURL +
        scheduleEndPoint +
        "getpersonalscheduletherapist",
      {},
      token
    ),
  therapistSchedule: (therapistID: string, token: string) =>
    requests.get(
      axios.defaults.baseURL + scheduleEndPoint + "gettherapistschedule",
      { therapistID },
      token
    ),
  rehabilitatorSchedule: (rehabilitatorID: string, token: string) =>
    requests.get(
      axios.defaults.baseURL + scheduleEndPoint + "getrehabilitatorschedule",
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
