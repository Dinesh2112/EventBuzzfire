import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/navbar';
import Frontpage from './component/frontpage';
import Cards from './component/cards';
import Footer from './component/footer';
import LoginPage from './component/Loginpage';  // Import your LoginPage component
import Signup from './component/Signup';

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
      </Routes>
    </Router>
  );
}

export default App;
