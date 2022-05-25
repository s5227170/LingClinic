import React, { FC, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Healthcare } from "../../../store/types";

import classes from "./HealthcareItem.module.css";

const HealthcareItem: FC<Healthcare> = ({
  _id,
  client,
  therapist,
  diagnosis,
  complete,
  initialisationDate,
  information,
  approved,
  rehabilitator,
  appointmentTherapist,
  appointmentsRehabilitator,
  appointmentsRehabRequired,
  documents,
  requirements,
  clientDocs,
}) => {
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const date = new Date(initialisationDate)
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = year + "/" + month + "/" + day;

  const viewHealthcareHandler = () => {
    if (authenticated) {
      console.log("relocate to booking");
      return navigate("/healthcareView/" + _id);
    }
    console.log("relocate to authenticate");
    return navigate("/authenticate");
  };

  return (
    <div className={classes.Wrapper} >
      <div className={classes.Details}>
        <div className={classes.Diagnosis}>
          <h4><b style={{ "color": "#000" }}>Diagnosis: </b>{diagnosis}</h4>
        </div>
        <div className={classes.DetailsInfo}>
          <div className={classes.DateStatus}>
            <div className={classes.Date}>
              <h4>{formattedDate}</h4>
            </div>
            <div className={classes.Status}>
              <h4>{complete ? "Inactive" : "Active"}</h4>
            </div>
          </div>
          <div className={classes.ActionAndView}>
            <div className={classes.Action}>
              {requirements.length > 0 ? (
                <Fragment>
                  <h4>Action required</h4>
                  <div className={classes.ActionLightOn}></div>
                </Fragment>
              ) : (
                <Fragment>
                  <h4>No action required</h4>
                  <div className={classes.ActionLightOff}></div>
                </Fragment>
              )}
            </div>
            <div className={classes.View} onClick={viewHealthcareHandler}>
              <span className="material-icons-outlined">
                visibility
              </span>
              <label>VIEW</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HealthcareItem;
