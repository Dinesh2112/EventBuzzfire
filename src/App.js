import React, {useEffect, useState} from 'react';
import "./App.css";
import { getDocs, collection } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { imgDB, txtDB, auth } from "./component/firebase";
import Navbar from './component/navbar';
import Frontpage from './component/frontpage';
import Cards from './component/cards';
import Footer from './component/footer';
import LoginPage from './component/Loginpage';  // Import your LoginPage component
import Signup from './component/Signup';
import CreateEvent from './component/create-event';
import Events from './component/Events';
import EventsDetails from './component/EventDetails';
import Dashboard from './component/Dashboard';
import {Link} from "react-router-dom"


const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<>
          <Navbar />
          <Frontpage />

          <Cards />


          <Footer />
        </>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<Events/>} />
        <Route path="/event/:userId/:eventId" element={<EventsDetails />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
