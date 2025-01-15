import React from "react";
import NotFoundImg from "../assets/NotFoundImage.svg";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={NotFoundImg} alt="notfound" />
      <p className="font-semibold">It looks like we can't find any results that match.</p>
    </div>
  );
};

export default PageNotFound;
