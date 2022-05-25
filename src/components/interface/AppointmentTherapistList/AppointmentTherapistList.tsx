import React, { Fragment, useEffect, useState } from "react";

import usePagination from "../../../hooks/usePagination/usePagination";
import AppointmentTherapistItem from "../AppointmentItem/AppointmentItem";
import { v4 as uuid } from "uuid";

import classes from "./AppointmentTherapistList.module.css";

const AppointmentTherapistList = ({ data, itemsPerPage, startFrom, mode }) => {
    const [show, setShow] = useState(false);
    const {
        slicedData,
        pagination,
        prevPage,
        nextPage,
        changePage,
    } = usePagination({ itemsPerPage, data, startFrom });

    useEffect(() => {
        slicedData.map(item => {
            if (item.status == mode)
                setShow(true)
        })
    }, [data])

    return (
        <Fragment>
            {slicedData.map(
                item => {
                    if (item.status == mode) {
                        return (
                            <AppointmentTherapistItem
                                key={uuid()}
                                _id={item._id}
                                therapist={item.professional}
                                client={item.client}
                                information={item.information}
                                startTime={item.StartTime}
                                endTime={item.EndTime}
                                mode={"Therapist"}
                                statusMode={item.status == "Pending" ? "Pending" : "Set"}
                                complete={item.complete}
                            />)
                    } else if (item.status == "Declined" && mode == "Set") {
                        return (<AppointmentTherapistItem
                            key={uuid()}
                            _id={item._id}
                            therapist={item.professional}
                            client={item.client}
                            information={item.information}
                            startTime={item.StartTime}
                            endTime={item.EndTime}
                            mode={"Therapist"}
                            statusMode={item.status}
                            complete={item.complete}
                        />)
                    }
                }
            )}
            {show ?
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
                :
                <h6>No appointments currently set</h6>}
        </Fragment>
    );
};

export default AppointmentTherapistList;
