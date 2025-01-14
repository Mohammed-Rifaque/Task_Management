import React, { useState } from "react";
import taskBuddyLogo from "./../assets/TaskBuddyLogo.svg";
import userProfile from "./../assets/userProfile.svg";
import LogoutIcon from "./../assets/LogoutIcon.svg";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, userName } = useUserStore();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    navigate("/signin");
  };

  return (
    <div className="flex justify-between items-center px-10 py-5 pt-8 bg-white">
      <div className="flex gap-3">
        <img src={taskBuddyLogo} alt="taskbuddyLogo" className="w-8 h-8" />
        <h1 className="text-2xl font-semibold text-black">TaskBuddy</h1>
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
            <img src={userProfile} alt="user profile" className="w-8 h-8 rounded-full cursor-pointer" />
            <span className="font-normal"> {userName.replace(/^"(.*)"$/, "$1")}</span>
          </div>
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-10 bg-[#FFF9F9] hover:bg-gray-100 border-[#ebd9e9] rounded-xl pl-5 pr-8 py-4 cursor-pointer"
              onClick={handleLogout}>
              <button className="rounded-xl flex gap-2 items-center font-semibold">
                <img src={LogoutIcon} alt="logout" className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
