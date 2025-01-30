import React, { useState } from "react";
import taskBuddyLogo from "./../assets/TaskBuddyLogo.svg";
import userProfile from "./../assets/userProfile.png";
import LogoutIcon from "./../assets/LogoutIcon.svg";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, userName, userProfilePic } = useUserStore();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfilePic");
    navigate("/signin");
  };

  return (
    <div className="flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={taskBuddyLogo} alt="TaskBuddy Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
        <h1 className="text-xl sm:text-2xl font-semibold text-black">TaskBuddy</h1>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
          <img
            src={userProfilePic || userProfile}
            alt="User Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300"
          />
          <span className="font-normal hidden sm:block">{userName.replace(/^"(.*)"$/, "$1")}</span>
        </div>

        {isDropdownOpen && (
          <div
            className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-40"
            onClick={handleLogout}
          >
            <button className="flex items-center gap-2 font-semibold text-gray-700 hover:text-red-600">
              <img src={LogoutIcon} alt="Logout" className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
