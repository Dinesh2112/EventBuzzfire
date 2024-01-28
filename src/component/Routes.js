import React from 'react';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
// import RegisterEventPage from './pages/RegisterEventPage';
import LoginPage from './Loginpage'; 

const Routes1 = () => {
  return (
    <Router>
        <Routes>
        {/* <Route path="/register-event" component={RegisterEventPage} /> */}
        <Route path="/login" component={LoginPage} /> 
      </Routes>
    </Router>
  );
};

export default Routes1;