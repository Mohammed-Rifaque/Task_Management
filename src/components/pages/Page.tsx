import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoardView from "./task/BoardView";
import ListView from "./task/ListView";
import { usePageTypeStore } from "../../store/usePageTypeStore";
import ListIcon from "../../assets/ListIcon.svg";
import BoardIcon from "../../assets/BoardIcon.svg";
import CreateTaskModal from "./task/modal/CreateTaskModal";
import EditTaskModal from "./task/modal/EditTaskModal";

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageType = usePageTypeStore((state) => state.pageType);
  const setPageType = usePageTypeStore((state) => state.setPageType);

  const pageTypes = [
    { type: "list" as "list", icon: ListIcon, label: "List" },
    { type: "board" as "board", icon: BoardIcon, label: "Board" }
  ];

  const handlePageChange = (type: "list" | "board") => {
    setPageType(type);
    navigate(`/${type}`);
  };

  useEffect(() => {
    if (location.pathname === "/list") {
      setPageType("list");
    } else if (location.pathname === "/board") {
      setPageType("board");
    }
  }, [location, setPageType]);

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <ul className="flex flex-row -mb-px text-lg text-center text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {pageTypes.map(({ type, icon, label }) => (
            <li className="me-2" role="button" tabIndex={0} key={type}>
              <button
                onClick={() => handlePageChange(type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handlePageChange(type);
                }}
                className={`${
                  pageType === type ? "active border-b-2 text-gray-900 font-medium border-gray-500" : "border-transparent"
                } flex items-center justify-center rounded-t-lg hover:text-gray-500 hover:border-gray-500 dark:hover:text-gray-500 group`}
                aria-label={`Switch to ${label} view`} // Added for accessibility
              >
                <img src={icon} alt={`${label} view icon`} className="w-5 h-5" />
                <span className="mx-2">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {pageType === "list" && <ListView />}
      {pageType === "board" && <BoardView />}
      <CreateTaskModal />
      <EditTaskModal />
    </div>
  );
};

export default Page;
