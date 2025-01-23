import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import SignIn from "./components/auth/SignIn";
import useUserStore from "./store/userStore";
import Page from "./components/pages/Page";

const App = () => {
  const location = useLocation();
  const { loggedIn } = useUserStore();

  const showNavbar = loggedIn && location.pathname !== "/signin";

  return (
    <div className="container mx-auto">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={loggedIn ? <Main /> : <Navigate to="/signin" replace />}>
          <Route index element={<Page />} />
          <Route path="/list" element={<Page />} />
          <Route path="/board" element={<Page />} />
        </Route>
        <Route path="/signin" element={!loggedIn ? <SignIn /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
