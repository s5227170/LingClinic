import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { Healthcare } from '../../../store/types';

import classes from './HealthcareProfessionalItem.module.css';

const HealthcareProfessionalItem: FC<Healthcare> = ({
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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authenticated, user } = useSelector((state: RootState) => state.auth);


    const date = new Date(initialisationDate)
    const month = date.getMonth() + 1; //months from 1-12
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedDate = year + "/" + month + "/" + day;

    const viewHealthcareHandler = () => {
        if (authenticated) {
            return navigate("/therapistHealthcareView/" + _id);
        }
    }

    return (
        <tr className={classes.Row}>
            <td>{client}</td>
            <td>{diagnosis}</td>
            <td><label>{appointmentsRehabRequired}</label></td>
            <td>{rehabilitator ? rehabilitator : <label>"N/A"</label>}</td>
            <td>{therapist}</td>
            <td>{formattedDate}</td>
            <td>
                <div className={classes.View} onClick={viewHealthcareHandler}>
                    <span className="material-icons-outlined">
                        visibility
                    </span>
                </div>
            </td>
        </tr>
    );
}

export default HealthcareProfessionalItem;