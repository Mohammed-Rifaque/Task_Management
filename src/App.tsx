import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import SignIn from "./components/auth/SignIn";

const App = () => {
  const location = useLocation();

  const showNavbar = location.pathname !== "/signin";

  return (
    <>
      <div className="container mx-auto">
      {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
