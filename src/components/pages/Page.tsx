import React from "react";
import BoardView from "./task/BoardView";
import ListView from "./task/ListView";
import { usePageTypeStore } from "../../store/usePageTypeStore";
import ListIcon from "../../assets/ListIcon.svg";
import BoardIcon from "../../assets/BoardIcon.svg";
import CreateTaskModal from "./task/CreateTaskModal";

const Page = () => {
  const pageType = usePageTypeStore((state) => state.pageType);
  const setPageType = usePageTypeStore((state) => state.setPageType);

  const handlePageType = (type: string) => {
    setPageType(type);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <ul className="flex flex-row -mb-px text-lg text-center text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <li className="me-2" role="button" tabIndex={0}>
            <button
              onClick={() => handlePageType("list")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePageType("list");
              }}
              className={`${
                pageType === "list" ? "active border-b-2 text-gray-500 border-gray-500" : "border-transparent"
              } flex items-center justify-center rounded-t-lg hover:text-gray-500 hover:border-gray-500 dark:hover:text-gray-500 group`}>
              <img src={ListIcon} alt="List view icon" className="w-5 h-5" />
              <span className="mx-2">List</span>
            </button>
          </li>
          <li className="me-2" role="button" tabIndex={0}>
            <button
              onClick={() => handlePageType("board")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePageType("board");
              }}
              className={`${
                pageType === "board" ? "active border-b-2 text-gray-500 border-gray-500" : "border-transparent"
              } flex items-center justify-center rounded-t-lg hover:text-gray-500 hover:border-gray-500 dark:hover:text-gray-500 group`}>
              <img src={BoardIcon} alt="Board view icon" className="w-5 h-5" />
              <span className="mx-2">Board</span>
            </button>
          </li>
        </ul>
      </div>

      {pageType === "list" && <ListView />}
      {pageType === "board" && <BoardView />}
      <CreateTaskModal />
    </div>
  );
};

export default Page;
