import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="px-10">
      <Outlet /> 
    </div>
  );
};

export default Main;
