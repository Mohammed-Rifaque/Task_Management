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
import useTaskStore from "../../../store/taskStore";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EnterIcon from "../../../assets/enterIcon.svg";

type SectionInterface = {
  status: string;
  tasks: any[];
  expanded: boolean;
  onAccordionChange: () => void;
  backgroundColor: string;
  hoverColor: string;
};

export const SectionAccordion = ({ status, tasks, expanded, onAccordionChange, backgroundColor, hoverColor }: SectionInterface) => {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [taskTitle, setTaskTitle] = useState<string>("");
  // Refs for button elements
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);
  const actionButtonRef = useRef<HTMLButtonElement | null>(null);
  // States for controlling dropdown visibility
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [actionDropDown, setActionDropDown] = useState<{ [key: string]: boolean }>({});

  // Toggle functions for dropdowns
  const handleStatusClick = () => setStatusDropdownOpen((prev) => !prev);
  const handleCategoryClick = () => setCategoryDropdownOpen((prev) => !prev);
  const handleActionClick = (index: number) => {
    setActionDropDown({ [`action-${index}`]: true });
  };

  const handleAddTask = () => {
    if (taskTitle && value) {
      const newTask = {
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
      setSelectedCategory("");
      console.log("Task added:", newTask);
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  const handleEdit = (index: number) => {
    console.log(`Delete task at index: ${index}`);
  };
  const handleDelete = (index: number) => {
    console.log(`Delete task at index: ${index}`);
  };
  // Functions to handle selecting values
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };
  return (
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
                              <AddIcon
                                sx={{
                                  color: "black",
                                  border: "1px solid gray",
                                  borderRadius: "32px",
                                  padding: "4px 0px"
                                }}
                              />
                            </Button>
                          )}

                          <Menu
                            open={statusDropdownOpen}
                            onClose={() => setStatusDropdownOpen(false)}
                            anchorEl={statusButtonRef.current}
                            sx={{
                              "& .MuiPaper-root": {
                                borderRadius: "12px"
                              }
                            }}
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
                              <Button sx={{ background: "#DDDADD", color: "black" }} onClick={handleCategoryClick} ref={categoryButtonRef}>
                                {selectedCategory}
                              </Button>
                            </Typography>
                          ) : (
                            <Button className="flex items-center" onClick={handleCategoryClick} ref={categoryButtonRef}>
                              <AddIcon
                                sx={{
                                  color: "black",
                                  border: "1px solid gray",
                                  borderRadius: "32px",
                                  padding: "4px 0px"
                                }}
                              />
                            </Button>
                          )}

                          <Menu
                            open={categoryDropdownOpen}
                            onClose={() => setCategoryDropdownOpen(false)}
                            anchorEl={categoryButtonRef.current}
                            sx={{
                              "& .MuiPaper-root": {
                                borderRadius: "12px"
                              }
                            }}
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
                tasks.map((task, index) => (
                  <TableRow key={index} className="hover:bg-gray-200">
                    <TableCell sx={{ width: "30%" }}>
                      <Checkbox />
                      {task.title}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Button sx={{ background: "#DDDADD", color: "black" }}>{task.status}</Button>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.category}</TableCell>

                    <TableCell sx={{ width: "10%" }}>
                      <Typography onClick={() => handleActionClick(index)} ref={actionButtonRef}>
                        <MoreHorizIcon />
                      </Typography>
                      <Menu
                        open={actionDropDown[index]}
                        onClose={() => setActionDropDown({ ...actionDropDown, [index]: false })}
                        anchorEl={actionButtonRef.current}
                        sx={{
                          "& .MuiPaper-root": {
                            borderRadius: "12px"
                          }
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left"
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left"
                        }}>
                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(index);
                          }}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(index);
                          }}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", height: "200px" }}>
                      No Tasks in {status}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </TableContainer>
  );
};
