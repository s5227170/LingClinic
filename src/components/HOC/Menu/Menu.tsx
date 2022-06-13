import React, { FC, Fragment, useState } from "react";
import NavItem from "../../interface/NavElement/NavElement";
import { RootState } from "../../../store";

import classes from "./Menu.module.css";
import { useSelector } from "react-redux";
import Header from "../Header/Header";

const Menu: FC = () => {
  const { authenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );
  const [menuState, setMenuState] = useState("neutral");

  const changeMenuStateHandler = () => {
    if (menuState == "open") {
      setMenuState("closed");
    } else {
      setMenuState("open");
    }
  };

  return (
    <div className={classes.Wrapper}>
      <div className={classes.Header}>
        <Header />
      </div>
      <div className={classes.Menu}>
        {/*Insert the different navigation options */}
        <NavItem
          icon={<i className="fa-solid fa-house" />}
          title="Home"
          to="/"
        />
        <NavItem
          icon={<i className="fa-regular fa-address-card"></i>}
          title="My Profile"
          to="/Profile"
        />
        <NavItem
          icon={<i className="fa-solid fa-circle-info" />}
          title="About"
          to="/About"
        />
        {authenticated ?
          <NavItem
            icon={<i className="fa-regular fa-calendar-plus"></i>}
            title="Book"
            to="/AppointmentTherapist"
          />
          :
          null}
        {userType == "Therapist"
          ? <Fragment>
            <NavItem
              icon={<i className="fa-regular fa-calendar-check"></i>}
              title="Clients"
              to="/ClientAppointments"
            />
          </Fragment>
          : null}
        {userType == "Rehabilitator"
          ? <Fragment>
            <NavItem
              icon={<i className="fa-regular fa-calendar-check"></i>}
              title="Clients"
              to="/Calendar"
            />
          </Fragment>
          : null}
        {!authenticated
          ? <NavItem
            icon={<i className="fa-solid fa-lock-open" />}
            title="Login"
            to="/Authenticate"
          />
          : <NavItem
            icon={<i className="fa-solid fa-lock" />}
            title="Logout"
            to="logout"
          />}

        {/*<NavItem icon={<i className="fa-solid fa-house"></i>} title="Home" />
                    <hr></hr> */}
      </div>
    </div>
  );
};

export default Menu;
