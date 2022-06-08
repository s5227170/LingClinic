import React, { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfessionalCard from '../../components/interface/ProfessionalCard/ProfessionalCard';

import Physiotherapist1 from '../../static/images/Physiotherapist 1.jpg';
import Rehabilitator1 from '../../static/images/Rehabilitator 1.jpg';
import Rehabilitator2 from '../../static/images/Rehabilitator 2.jpg';

import classes from './About.module.css';

const About: FC = () => {
    const { service } = useParams();
    const s1 = useRef<HTMLDivElement>(null)
    const s2 = useRef<HTMLDivElement>(null)
    const s3 = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (service == "1") {
            if (s1.current) {
                s1.current.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        } else if (service == "2") {
            if (s2.current) {
                s2.current.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        } else if (service == "3") {
            if (s3.current) {
                s3.current.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        }

    }, [])

    return (
        <div className={classes.Wrapper}>
            <div className={classes.InnerWrapper}>
                <h1>About</h1>
                <p>Ling clinic is a new physiotherapy clinic that is based on overcoming of physical disturbances of the musculoskeletal system caused by various condition, illnesses, injuries, and others. We utilise modern physiotherapy devices and aparatus to deliver the highest quality possible when it comes to providing services. The clinic uses modern physiotherapy systems for muscle stimulation, ultrasound therapy, water treatment, deep oscillation. The staff are professionals of high calibre with degrees in top universities and vast experience. They are involved in the creation of physiotherapy programs, and the education of clients on their application, while providing extra knowledge for home therapy. Physiotherapy treatments affect the whole body in a positive way when done regularly.</p>
                <div className={classes.Location}>
                    <iframe
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src="https://www.google.com/maps/embed/v1/search?key=AIzaSyC5IlFqmXzh8_nvQJ60p6oTSsaoxFUxYn4&zoom=14&q=Serdika II&center=42.6977,23.3219">
                    </iframe>
                </div>
                <h1>Services</h1>
                <div ref={s1} className={classes.Service}>
                    <h3>Prevention and beauty</h3>
                    <div className={classes.ServiceHeader}>
                        <h4>Massages</h4>
                        <h6>we offer a wide range of massages which you can experience, such as:</h6>
                    </div>
                    <ul>
                        <li>
                            <u>Relaxing massage:</u> a natural physical remedy with wide application in disease prevention, sports and treatment of different complications. Helps to overcome body stress caused by daily lifestyle;
                        </li>
                        <li>
                            <u>Cupping therapy:</u> improves blood flow and nutrition to body tissue. It is being applied as anti – cellulite therapy, shapes the body, relief pain, relaxes the body and consciousness and others;
                        </li>
                        <li>
                            <u>Sport massage:</u> used to warm up the body before strenuous exercises or to relax the musculature after competitions and DOMS and others.
                        </li>
                    </ul>
                    <div className={classes.ServiceHeader}>
                        <h4>Gymnastics</h4>
                        <h6>you can take advantages of different types of gymnastics such as: </h6>
                    </div>
                    <ul>
                        <li>
                            <u>Basic gymnastic:</u>it is easily applicable to all ages, and no special equipment is needed. You could do these exercises at home, at the park, or anywhere with enough space, with a friend or alone.
                        </li>
                        <li>
                            <u>Water gymnastic:</u>a way to keep in shape and socialize with other people.
                        </li>
                    </ul>
                </div>
                <div ref={s2} className={classes.Service}>
                    <h3>Kinesitherapy and Temporary Treatment</h3>
                    <div className={classes.ServiceHeader}>
                        <h4>Physiotherapy</h4>
                        <h6>when it comes to physiotherapy we utilize modern technology. We offer you:</h6>
                    </div>
                    <ul>
                        <li>
                            <u>Interference current:</u> improves blood flows, stimulates peripheral nerves, relief pain, anti - inflammatory, relax muscle and other;
                        </li>
                        <li>
                            <u>Ultrasound therapy:</u> relief pain, anti - inflammatory, antispasmodic, stimulate regeneration of tissue, improves circulation and nutrition absorption;
                        </li>
                        <li>
                            <u>Paraffin treatment:</u> used in the treatment of scars after surgical operations, increases tissue healing, beneficial effects on spasms and others.
                        </li>
                    </ul>
                    <div className={classes.ServiceHeader}>
                        <h4>Muscular energy techniques</h4>
                        <h6>delicate and highly efficient tool used for overcoming of muscle unbalances and diagnosing. We use:</h6>
                    </div>
                    <ul>
                        <li>
                            <u>Postisometric relaxation:</u>mainly used against pain relief, or for decrease muscle tone at body trigger points
                        </li>
                        <li>
                            <u>Reciprocal inhibition:</u>it is utilised in intense cases of muscle issues, traumas, and as preparation for joint mobilization.
                        </li>
                    </ul>
                </div>
                <div ref={s3} className={classes.Service}>
                    <h3>Treatment around disorders</h3>
                    <div className={classes.ServiceHeader}>
                        <h4>Education of rehabilitation and daily practices</h4>
                        <h6>we provide education of personal care and rehabilitation practices to caregivers such as:</h6>
                    </div>
                    <ul>
                        <li>
                            Moving from wheelchair
                        </li>
                        <li>
                            Turning in bed
                        </li>
                        <li>
                            Rehabilitation in bed
                        </li>
                        <li>
                            Toileting
                        </li>
                    </ul>
                    <div className={classes.ServiceHeader}>
                        <h4>Special methods </h4>
                        <h6>applied in situations when the patient has cerebral palsy:</h6>
                    </div>
                    <ul>
                        <li>
                            <u>Methodology of Bobath:</u>aims at achieving functional independence through assistance using similar to everyday movements
                        </li>
                        <li>
                            <u>Methodology of Vojta:</u>meant to assist in the elimination of different complications of any kind
                        </li>
                    </ul>
                </div>
                <h1>Professionals</h1>
                <ProfessionalCard phone={"07777777777"} bio="Doctor, graduated at the Medical University of Sofia with major 'Doctor Of Medicine'. Has 15 years of expecience with clients and is considered one of the top physiotherapists in Bulgaria." title="Therapist" img={Physiotherapist1} name="Bill Taylor" />
                <ProfessionalCard phone={"07777777777"} bio="Graduated a Kinesitherapy bachelors degree in the university of Ruse 'Angel Kunchev' and later on a masters degree of 'Wellness and Spa' at university of Varna. Has 5 years of experience working with a variety of clients with different health status. Excels at rehabilitation of bones and joints post-surgury." title="Rehabilitator" img={Rehabilitator1} name="Rin Foster" />
                <ProfessionalCard phone={"07777777777"} bio="A recent addition to the team. Graduated Kinesitherapy at the National Sports Academy 'Vasil Levski', Sofia. Receives their first masters degree at the university with major 'Sports and Safety', and further on a second masters degree, with a masters of 'Adaptated Physical Activity and Sports'." title="Rehabilitator" img={Rehabilitator2} name="Kamelia Smith" />
            </div>
        </div>
    );
}

export default About;