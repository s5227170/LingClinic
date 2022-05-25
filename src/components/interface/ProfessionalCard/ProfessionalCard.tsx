import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './ProfessionalCard.module.css';

interface Props {
    bio: string;
    title: "Therapist" | "Rehabilitator";
    name: string;
    img: any;
    phone: string;
}

const ProfessionalCard: FC<Props> = ({ img: img, bio: bio, title: title, name: name, phone }) => {
    const navigate = useNavigate();

    const bookHandler = () => {
        return navigate("/appointmentTherapist")
    }

    return (
        <div className={title == "Therapist" ? classes.WrapperTherapist : classes.WrapperRehabilitator}>
            <div className={classes.Avatar}>
                <img className={classes.AvatarImage} src={img ? img : ""} alt={title + " " + name} />
            </div>
            <div className={classes.Details}>
                <div className={title == "Therapist" ? classes.TitleBioTherapist : classes.TitleBioRehabilitator}>
                    <h4>{title}</h4>
                    <hr></hr>
                    <p><b>{name}</b>{". " + bio}</p>
                    <div className={classes.Phone}>
                        <label><b>Mobile:</b></label>
                        <label><u>{phone}</u></label>
                    </div>
                </div>
                {title == "Therapist" ?
                    <div className={classes.Book}>
                        <button onClick={bookHandler}>Book an Appointment</button>
                    </div>
                    :
                    null
                }
            </div>
        </div>
    );
}

export default ProfessionalCard;