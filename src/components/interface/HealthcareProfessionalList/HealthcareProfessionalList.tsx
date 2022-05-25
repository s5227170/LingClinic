import React, {
    FC,
    Fragment,
    InputHTMLAttributes,
    useEffect,
    useState
} from "react";

import classes from "./HealthcareProfessionalList.module.css";
import usePagination from "../../../hooks/usePagination/usePagination";
import HealthcareProfessionalItem from "../HealthcareProfessionalItem/HealthcareProfessionalItem";

const HealthcareProfessionalList = ({ data, itemsPerPage, startFrom }) => {
    const {
        slicedData,
        pagination,
        prevPage,
        nextPage,
        changePage
    } = usePagination({ itemsPerPage, data, startFrom });

    return (
        <Fragment>
            {slicedData.map(item => {
                return (
                    <HealthcareProfessionalItem
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
                        appointmentsRehabRequired={item.appointmentsRehabRequired}
                        documents={item.documents}
                        requirements={item.requirements}
                        clientDocs={item.clientDocs}
                        therapistRequirement={item.therapistRequirement}
                    />
                );
            })}
            <tr>
                <td colSpan={7}>
                    <div className={classes.Pagination}>
                        <div className={classes.PageWrapper}>
                            <a href="/#" className={classes.PreviousPage} onClick={prevPage}>
                                Previous
                            </a>
                        </div>
                        <ul className={classes.List}>
                            {pagination.map(page => {
                                if (!page.ellipsis) {
                                    return (
                                        <li key={page.id}>
                                            <div className={classes.PageWrapper}>
                                                <a
                                                    href="/#"
                                                    className={
                                                        page.current
                                                            ? classes.CurrentPage
                                                            : classes.OtherPages
                                                    }
                                                    onClick={e => changePage(page.id, e)}
                                                >
                                                    {page.id}
                                                </a>
                                            </div>
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
                            <div className={classes.PageWrapper}>
                        <a href="/#" className={classes.NextPage} onClick={nextPage}>
                            Next
                        </a>
                    </div>
                </div>
            </td>
        </tr>
        </Fragment >
    );
};

export default HealthcareProfessionalList;
