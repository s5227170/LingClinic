import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { useEffect, useState } from 'react';

import Menu from './components/HOC/Menu/Menu';
import Footer from './components/HOC/Footer/Footer';
import Header from './components/HOC/Header/Header';
import ScrollToTop from './components/HOC/ScrollToTop/ScrollToTop';

import Homepage from './pages/Homepage/Homepage';
import Authenticate from './pages/Authenticate/Authentication';
import About from './pages/About/About';
import { onAuthStateChanged } from "firebase/auth";

import './App.css';
import { getuserbyid, setLoading } from './store/actions/auth';
import { auth } from './firebase';
import { Oval, Watch } from "react-loader-spinner";

import HealthcareView from './pages/Healthcare View/HealthcareView';
import Profile from './pages/Profile/Profile';
import AppointmentTherapist from './pages/AppointmentTherapist/AppointmentTherapist';
import ClientAppointments from './pages/ClientAppointments/ClientAppointments';
import HealthcareCreate from './pages/Healthcare Create/HealthcareCreate';
import AppointmentRehabilitator from './pages/AppointmentRehabilitator/AppointmentRehabilitator';
import Calendar from './pages/Calendar/Calendar';
import ClientHealthcares from './pages/ClientHealthcares/ClientHealthcares';
import TherapistHealthcareView from './pages/TherapisthealthcareView/TherapistHealthcareView';
import PageLoader from './components/interface/PageLoader/PageLoader';

function App() {
  const dispatch = useDispatch();
  const { authenticated, userType, loading, authComplete } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const authenticator = auth;
    const unsubscribe = onAuthStateChanged(authenticator, async (user) => {
      if (user) {
        dispatch(getuserbyid(user));
      }
    });

    return () => {
      unsubscribe();
    };

  }, [dispatch]);

  if (loading) {
    return <PageLoader />
  }

  return (
    <BrowserRouter>
      <ScrollToTop>
        <Menu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/:service" element={<About />} />
          <Route path="/authenticate" element={!authenticated ? <Authenticate /> : <Navigate to="/" />} />
          <Route path="/healthcare" element={authenticated ? <HealthcareView /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/profile" element={authenticated ? <Profile /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/appointmentTherapist" element={authenticated ? <AppointmentTherapist /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/appointmentRehabilitator/:id" element={authenticated ? <AppointmentRehabilitator /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/healthcareView/:id" element={authenticated ? <HealthcareView /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/healthcareCreate/:id" element={authenticated ? <HealthcareCreate /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/therapistHealthcareView/:id" element={authenticated && (userType == "Therapist" || userType == "Rehabilitator") ? <TherapistHealthcareView /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/clientAppointments" element={authenticated && (userType == "Therapist") ? <ClientAppointments /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/clientHealthcares" element={authenticated && (userType == "Therapist" || userType == "Rehabilitator") ? <ClientHealthcares /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="/calendar" element={authenticated && (userType == "Therapist" || userType == "Rehabilitator") ? <Calendar /> : authComplete ? <Navigate to="/authenticate" /> : PageLoader} />
          <Route path="*" element={<div id="errorPage">
            <h1>No such page</h1>
          </div>} />
        </Routes>
        <Footer />
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
