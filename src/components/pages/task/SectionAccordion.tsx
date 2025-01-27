import React, { useRef, useState } from "react";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Input,
  Menu,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useTaskStore from "../../../store/useTaskStore";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EnterIcon from "../../../assets/enterIcon.svg";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TasksSelectIcon from "../../../assets/taskIconSelect.svg";

type SectionInterface = {
  status: string;
  tasks: any[];
  expanded: boolean;
  onAccordionChange: () => void;
  backgroundColor: string;
  hoverColor: string;
};

export const SectionAccordion = ({ status, tasks, expanded, onAccordionChange, backgroundColor, hoverColor }: SectionInterface) => {
  const { openEditModal, deleteTask } = useTaskStore();
  const [value, setValue] = useState<Dayjs | null>(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const statusButtonRefs = useRef<HTMLButtonElement | null>(null);
  const statusSelectButtonRefs = useRef<HTMLButtonElement | null>(null);

  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectStatusDropdownOpen, setSelectStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [actionDropDown, setActionDropDown] = useState<{ [key: number]: boolean }>({});
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const actionButtonRefs = useRef<{ [key: number]: React.RefObject<HTMLButtonElement | null> }>({});

  const handleStatusClick = () => setStatusDropdownOpen((prev) => !prev);
  const handleStatusSelectClick = () => setSelectStatusDropdownOpen((prev) => !prev);
  const handleCategoryClick = () => setCategoryDropdownOpen((prev) => !prev);

  const handleAddTask = () => {
    if (taskTitle && value) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        dueDate: value.toISOString(),
        status: selectedStatus,
        category: selectedCategory,
        attachment: null,
        description: ""
      };
      useTaskStore.getState().addTask({ ...newTask });
      setShowAddRow(false);
      setTaskTitle("");
      setValue(null);
      setSelectedStatus("");
      setSelectStatus("");
      setSelectedCategory("");
      console.log("Task added:", newTask);
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  const handleActionClick = (index: number) => {
    setActionDropDown((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEdit = (taskId: number) => {
    setActionDropDown((prev) => {
      const updatedDropDown = { ...prev };
      Object.keys(updatedDropDown).forEach((key) => {
        updatedDropDown[Number(key)] = false;
      });
      return updatedDropDown;
    });
    openEditModal(taskId);
  };

  const handleDelete = (taskId: number) => {
    deleteTask(taskId);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };
  const handleSelectStatus = (status: string) => {
    setSelectStatus(status);
    setStatusDropdownOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };
  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId) ? prevSelected.filter((id) => id !== taskId) : [...prevSelected, taskId]
    );
  };

  const handleDeleteSelected = () => {
    useTaskStore.getState().deleteTasks(selectedTasks);
    setSelectedTasks([]);
  };
  return (
    <>
      <TableContainer component={Paper} className="mb-6 shadow-md" sx={{ borderRadius: "16px" }}>
        <Accordion
          expanded={expanded}
          onChange={onAccordionChange}
          sx={{
            backgroundColor,
            "&:hover": {
              backgroundColor: hoverColor
            }
          }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="font-bold">
              {status} ({tasks.length})
            </h1>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Table className="bg-[#f1f1f1]">
              <TableBody>
                {status === "To-Do" && (
                  <>
                    <TableRow className="hover:bg-gray-200">
                      <TableCell sx={{ width: "30%" }}>
                        <Button className="flex items-center" onClick={() => setShowAddRow(true)}>
                          <AddIcon sx={{ color: "black" }} />
                          <Typography color="initial" sx={{ fontWeight: "bold" }}>
                            ADD TASK
                          </Typography>
                        </Button>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}></TableCell>
                      <TableCell sx={{ width: "20%" }}></TableCell>
                      <TableCell sx={{ width: "20%" }}></TableCell>
                      <TableCell sx={{ width: "10%" }}></TableCell>
                    </TableRow>

                    {showAddRow && (
                      <>
                        <TableRow className="hover:bg-gray-200">
                          <TableCell sx={{ width: "30%" }}>
                            <Input
                              placeholder="Task Title"
                              sx={{ border: "unset" }}
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                            />
                          </TableCell>
                          <TableCell sx={{ width: "20%" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={value}
                                onChange={(newValue: Dayjs | null) => setValue(newValue)}
                                format="DD/MM/YYYY"
                                slotProps={{
                                  textField: {
                                    InputLabelProps: { shrink: false },
                                    sx: { borderRadius: "32px" }
                                  }
                                }}
                              />
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell sx={{ width: "20%" }}>
                            {selectedStatus ? (
                              <Typography>
                                <Button sx={{ background: "#DDDADD", color: "black" }} onClick={handleStatusClick} ref={statusButtonRef}>
                                  {selectedStatus}
                                </Button>
                              </Typography>
                            ) : (
                              <Button className="flex items-center" onClick={handleStatusClick} ref={statusButtonRef}>
                                <AddIcon sx={{ color: "black", border: "1px solid gray", borderRadius: "32px", padding: "4px 0px" }} />
                              </Button>
                            )}
                            <Menu
                              open={statusDropdownOpen}
                              onClose={() => setStatusDropdownOpen(false)}
                              anchorEl={statusButtonRef.current}
                              sx={{ "& .MuiPaper-root": { borderRadius: "12px" } }}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left"
                              }}>
                              <MenuItem onClick={() => handleStatusSelect("TO-DO")}>TO-DO</MenuItem>
                              <MenuItem onClick={() => handleStatusSelect("IN-PROGRESS")}>IN-PROGRESS</MenuItem>
                              <MenuItem onClick={() => handleStatusSelect("COMPLETED")}>COMPLETED</MenuItem>
                            </Menu>
                          </TableCell>

                          <TableCell sx={{ width: "20%" }}>
                            {selectedCategory ? (
                              <Typography>
                                <Button
                                  sx={{ background: "#DDDADD", color: "black" }}
                                  onClick={handleCategoryClick}
                                  ref={categoryButtonRef}>
                                  {selectedCategory}
                                </Button>
                              </Typography>
                            ) : (
                              <Button className="flex items-center" onClick={handleCategoryClick} ref={categoryButtonRef}>
                                <AddIcon sx={{ color: "black", border: "1px solid gray", borderRadius: "32px", padding: "4px 0px" }} />
                              </Button>
                            )}
                            <Menu
                              open={categoryDropdownOpen}
                              onClose={() => setCategoryDropdownOpen(false)}
                              anchorEl={categoryButtonRef.current}
                              sx={{ "& .MuiPaper-root": { borderRadius: "12px" } }}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left"
                              }}>
                              <MenuItem onClick={() => handleCategorySelect("Work")}>WORK</MenuItem>
                              <MenuItem onClick={() => handleCategorySelect("Personal")}>PERSONAL</MenuItem>
                            </Menu>
                          </TableCell>

                          <TableCell sx={{ width: "10%" }}></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                            <div className="flex bg-[#F1F1F1] p-4 rounded-b-3xl">
                              <button
                                onClick={handleAddTask}
                                className="flex gap-2 bg-[#7B1984] text-white text-sm font-medium px-7 py-3 rounded-3xl mr-2">
                                ADD
                                <img src={EnterIcon} alt="add" className="h-4 w-4 text-white" />
                              </button>
                              <button
                                onClick={() => setShowAddRow(false)}
                                className="bg-[#ffffff] border text-black text-sm font-medium px-7 py-3 rounded-3xl mr-2">
                                CANCEL
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </>
                )}
                {tasks.length > 0 ? (
                  tasks.map((task, index) => {
                    if (!actionButtonRefs.current[index]) {
                      actionButtonRefs.current[index] = React.createRef();
                    }
                    return (
                      <TableRow key={task.id} className="hover:bg-gray-200">
                        <TableCell sx={{ width: "30%" }}>
                          <div className="flex gap-2  items-center">
                            <Checkbox
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => handleCheckboxChange(task.id)}
                              sx={{ "&.Mui-checked": { color: "#7B1984" } }}
                            />
                            <CheckCircleRoundedIcon className={`${task.status === "COMPLETED" ? "text-green-600" : "text-gray-400"}`} />
                            <p className={`${task.status === "COMPLETED" && "line-through font-bold text-gray-700"}`}>{task.title}</p>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                          {new Date(task.dueDate).toDateString() === new Date().toDateString()
                            ? "Today"
                            : new Date(task.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                          <Button sx={{ background: "#DDDADD", color: "black" }}>{task.status}</Button>
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>{task.category}</TableCell>

                        <TableCell sx={{ width: "10%" }}>
                          <Typography onClick={() => handleActionClick(index)}>
                            <Button ref={actionButtonRefs.current[index]}>
                              <MoreHorizIcon className="text-gray-500" />
                            </Button>
                          </Typography>
                          <Menu
                            open={actionDropDown[index]}
                            onClose={() => setActionDropDown((prev) => ({ ...prev, [index]: false }))}
                            anchorEl={actionButtonRefs.current[index]?.current}
                            sx={{ "& .MuiPaper-root": { borderRadius: "12px" } }}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left"
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left"
                            }}>
                            <MenuItem onClick={() => handleEdit(task.id)}>Edit</MenuItem>
                            <MenuItem onClick={() => handleDelete(task.id)}>Delete</MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", height: "200px" }}>
                      No Tasks in {status}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </TableContainer>
      {selectedTasks.length > 0 && (
        <div className="fixed z-10 bottom-0 mb-2 left-0 right-0 w-full text-white flex justify-center items-center">
          <div className="flex justify-between items-center w-1/3 bg-[#1A1C20] px-4 py-4 rounded-2xl flex-wrap">
            <div className="flex gap-2 items-center">
              <div className="border rounded-3xl px-4 py-3">{selectedTasks.length} tasks selected</div>
              <img src={TasksSelectIcon} alt="selectedIcon" className="w-8" />
            </div>
            <div className="flex gap-4">
              {selectStatus ? (
                <Typography>
                  <Button
                    className="flex items-center"
                    style={{ border: "1px solid white", color: "white" }}
                    variant="outlined"
                    sx={{ borderRadius: "32px", padding: "6px 16px" }}
                    onClick={handleStatusSelectClick}
                    ref={statusSelectButtonRefs}>
                    {selectStatus}
                  </Button>
                </Typography>
              ) : (
                <Button
                  className="flex items-center"
                  style={{ border: "1px solid white", color: "white" }}
                  variant="outlined"
                  sx={{ borderRadius: "32px", padding: "6px 16px" }}
                  onClick={handleStatusSelectClick}
                  ref={statusSelectButtonRefs}>
                  Status
                </Button>
              )}
              <Menu
                open={selectStatusDropdownOpen}
                onClose={() => setSelectStatusDropdownOpen(false)}
                anchorEl={statusSelectButtonRefs.current}
                sx={{ top:"-5%", "& .MuiPaper-root": { borderRadius: "12px", background: "#1A1C20", color: "white", } }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}>
                <MenuItem onClick={() => handleSelectStatus("TO-DO")}>TO-DO</MenuItem>
                <MenuItem onClick={() => handleSelectStatus("IN-PROGRESS")}>IN-PROGRESS</MenuItem>
                <MenuItem onClick={() => handleSelectStatus("COMPLETED")}>COMPLETED</MenuItem>
              </Menu>

              <Button onClick={handleDeleteSelected} variant="outlined" color="error" sx={{ borderRadius: "32px" }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
