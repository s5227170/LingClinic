import React, { Fragment, useEffect } from "react";

import usePagination from "../../../hooks/usePagination/usePagination";
import AppointmentItem from "../AppointmentItem/AppointmentItem";
import HealthcareItem from "../HealthcareItem/HealthcareItem";
import { v4 as uuid } from "uuid";

import classes from "./HealthcareAndAppointmentList.module.css";

const HealthcareAndAppointmentList = ({ data, itemsPerPage, startFrom }) => {
  const {
    slicedData,
    pagination,
    prevPage,
    nextPage,
    changePage,
  } = usePagination({ itemsPerPage, data, startFrom });
  
  return (
    <div className={classes.Wrapper}>
      <div className={classes.HealthcareContent}>
        {slicedData.map(
          item =>
            item.type == "healthcare"
              ? <HealthcareItem
                key={uuid()}
                _id={item._id}
                client={item.client}
                therapist={item.therapist}
                diagnosis={item.diagnosis}
                complete={item.complete}
                initialisationDate={item.initialisationDate}
                information={item.information}
                approved={item.approved}
                rehabilitator={item.rehabilitator}
                appointmentTherapist={item.appointmentTherapist}
                appointmentsRehabilitator={item.appointmentsRehabilitator}
                documents={item.documents}
                requirements={item.requirements}
                appointmentsRehabRequired={item.appointmentsRehabRequired}
                clientDocs={item.clientDocs}
                therapistRequirement={item.therapistRequirement}
              />
              : <AppointmentItem
                key={uuid()}
                _id={item._id}
                therapist={item.professional}
                client={item.client}
                information={item.information}
                startTime={item.StartTime}
                endTime={item.EndTime}
                mode={"Client"}
                statusMode={item.status}
                complete={item.complete}
              />
        )}
      </div>
      <div className={classes.Pagination}>
        <a href="/#" className={classes.PreviousPage} onClick={prevPage}>
          Previous
        </a>
        <ul className={classes.List}>
          {pagination.map(page => {
            if (!page.ellipsis) {
              return (
                <li key={page.id}>
                  <a
                    href="/#"
                    className={
                      page.current ? classes.CurrentPage : classes.OtherPages
                    }
                    onClick={e => changePage(page.id, e)}
                  >
                    {page.id}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={page.id}>
                  <span className={classes.Ellipsis}>&hellip;</span>
                </li>
              );
            }
          })}
        </ul>
        <a href="/#" className={classes.NextPage} onClick={nextPage}>
          Next
        </a>
      </div>
    </div>
  );
};

export default HealthcareAndAppointmentList;
