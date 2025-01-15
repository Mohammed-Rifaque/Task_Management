import React, { useState } from "react";
import {
  Checkbox,
  Typography,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
  TableRow,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import PageNotFound from "../../PageNotFound";
import Filter from "./Filter";

interface Task {
  id: number;
  name: string;
  dueDate: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: string;
}

const tasks: Task[] = [
  { id: 1, name: "Morning Workout", dueDate: "Today", status: "IN-PROGRESS", category: "Work" },
  { id: 2, name: "Code Review", dueDate: "Today", status: "IN-PROGRESS", category: "Personal" },
  { id: 3, name: "Update Task Tracker", dueDate: "25 Dec, 2024", status: "IN-PROGRESS", category: "Work" },
  { id: 4, name: "Submit Project Proposal", dueDate: "Today", status: "COMPLETED", category: "Work" },
  { id: 5, name: "Birthday Gift Shopping", dueDate: "Today", status: "COMPLETED", category: "Personal" },
  { id: 6, name: "Client Presentation", dueDate: "25 Dec, 2024", status: "COMPLETED", category: "Work" },
  { id: 7, name: "Interview for New Position", dueDate: "Tomorrow", status: "TO-DO", category: "Work" },
  { id: 8, name: "Grocery Shopping", dueDate: "Today", status: "TO-DO", category: "Personal" }
];

const ListView: React.FC = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    todo: true,
    inProgress: true,
    completed: true
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");


  const handleAccordionChange = (section: string) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value as string);
  };

  const handleDueDateChange = (event: SelectChangeEvent<string>) => {
    setDueDateFilter(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTasks = (status: string) => tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen">
      {/* Filter Section */}
   <Filter handleCategoryChange={handleCategoryChange} handleDueDateChange={handleDueDateChange} handleSearchChange={handleSearchChange} categoryFilter={categoryFilter} dueDateFilter={dueDateFilter} searchQuery={searchQuery} />

      <TableContainer component={Paper} className="mb-2" sx={{background: "transparent", boxShadow: "none", borderTop: "1px solid #E0E0E0"}}>
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell className="font-bold" sx={{ width: "30%" }}>
                Task Name
              </TableCell>
              <TableCell className="font-bold" sx={{ width: "20%" }}>
                Due Date
              </TableCell>
              <TableCell className="font-bold" sx={{ width: "20%" }}>
                Task Status
              </TableCell>
              <TableCell className="font-bold" sx={{ width: "20%" }}>
                Task Category
              </TableCell>
              <TableCell className="font-bold" sx={{ width: "10%" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* To-Do Section */}
      <TableContainer component={Paper} className="mb-6 shadow-md" sx={{ borderRadius: "16px" }}>
        <Accordion
          expanded={expanded.todo}
          onChange={() => handleAccordionChange("todo")}
          sx={{
            backgroundColor: "#FAC3FF",
            "&:hover": {
              backgroundColor: "#BB70C2"
            }
          }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="font-bold">To-Do ({filteredTasks("TO-DO").length})</h1>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Table className="bg-[#f1f1f1]">
              <TableBody>
                {filteredTasks("TO-DO").map((task) => (
                  <TableRow key={task.id} className=" hover:bg-gray-200">
                    <TableCell sx={{ width: "30%" }}>
                      <Checkbox />
                      {task.name}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.dueDate}</TableCell>
                    <TableCell sx={{ width: "20%" }}><Button sx={{background:"#DDDADD", color:"black"}}>{task.status}</Button></TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.category}</TableCell>
                    <TableCell sx={{ width: "10%" }}>...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </TableContainer>

      {/* In-Progress Section */}
      <TableContainer component={Paper} className="mb-6 shadow-md" sx={{ borderRadius: "16px" }}>
        <Accordion
          expanded={expanded.inProgress}
          onChange={() => handleAccordionChange("inProgress")}
          sx={{
            backgroundColor: "#85D9F1",
            "&:hover": {
              backgroundColor: "#67A0B1"
            }
          }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="font-bold">In-Progress ({filteredTasks("IN-PROGRESS").length})</h1>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Table className="bg-[#f1f1f1]">
              <TableBody>
                {filteredTasks("IN-PROGRESS").map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-200">
                    <TableCell sx={{ width: "30%" }}>
                      <Checkbox />
                      {task.name}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.dueDate}</TableCell>
                    <TableCell sx={{ width: "20%" }}><Button sx={{background:"#DDDADD", color:"black"}}>{task.status}</Button></TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.category}</TableCell>
                    <TableCell sx={{ width: "10%" }}>...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </TableContainer>

      {/* Completed Section */}
      <TableContainer component={Paper} className="mb-6 shadow-md" sx={{ borderRadius: "16px" }}>
        <Accordion
          expanded={expanded.completed}
          onChange={() => handleAccordionChange("completed")}
          sx={{
            backgroundColor: "#CEFFCC",
            "&:hover": {
              backgroundColor: "#A0D59E"
            }
          }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="font-bold">Completed ({filteredTasks("COMPLETED").length})</h1>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Table className="bg-[#f1f1f1]">
              <TableBody>
                {filteredTasks("COMPLETED").map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-200">
                    <TableCell sx={{ width: "30%" }}>
                      <Checkbox />
                      {task.name}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.dueDate}</TableCell>
                    <TableCell sx={{ width: "20%" }}><Button sx={{background:"#DDDADD", color:"black"}}>{task.status}</Button></TableCell>
                    <TableCell sx={{ width: "20%" }}>{task.category}</TableCell>
                    <TableCell sx={{ width: "10%" }}>...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </TableContainer>

      <PageNotFound />

    </div>
  );
};

export default ListView;
