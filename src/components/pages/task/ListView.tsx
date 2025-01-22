import React, { useState } from "react";
import { Paper, Table, TableHead, TableCell, TableContainer, TableRow, SelectChangeEvent, IconButton } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useTaskStore from "../../../store/useTaskStore";
import Filter from "./Filter";
import { SectionAccordion } from "./SectionAccordion";

const ListView = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    todo: true,
    inProgress: true,
    completed: true
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const statusMapping: Record<string, string[]> = {
    "TO-DO": ["TO-DO"],
    "IN-PROGRESS": ["IN-PROGRESS"],
    COMPLETED: ["COMPLETED"]
  };

  const filteredTasks = (status: string) => {
    return tasks.filter((task) => {
      const matchesStatus = statusMapping[status]?.includes(task.status);
      const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
      const matchesSearch = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;

      return matchesStatus && matchesCategory && matchesSearch;
    });
  };

  const handleAccordionChange = (status: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [status]: !prevExpanded[status] // Dynamically toggle the expansion based on status
    }));
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

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  return (
    <div className="min-h-screen">
      <Filter
        handleCategoryChange={handleCategoryChange}
        handleDueDateChange={handleDueDateChange}
        handleSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        dueDateFilter={dueDateFilter}
        searchQuery={searchQuery}
      />
      <TableContainer
        component={Paper}
        className="mb-2"
        sx={{ background: "transparent", boxShadow: "none", borderTop: "1px solid #E0E0E0" }}>
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell className="font-bold" sx={{ width: "30%" }}>
                Task Name
              </TableCell>
              <TableCell className="font-bold" sx={{ width: "20%" }}>
                <div className="flex items-center">
                  Due Date
                  <IconButton
                    onClick={toggleSortOrder}
                    size="small"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      padding: "0",
                      marginLeft: 1,
                      lineHeight: 0
                    }}>
                    <ArrowDropUpIcon
                      sx={{
                        color: sortOrder === "asc" ? "black" : "gray",
                        fontSize: "20px",
                        marginBottom: 0
                      }}
                    />
                    <ArrowDropDownIcon
                      sx={{
                        color: sortOrder === "desc" ? "black" : "gray",
                        fontSize: "20px",
                        marginTop: 0
                      }}
                    />
                  </IconButton>
                </div>
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

      {/* Section Accordion */}
      <SectionAccordion
        status="To-Do"
        expanded={expanded.todo}
        tasks={sortTasks(filteredTasks("TO-DO"))}
        onAccordionChange={() => handleAccordionChange("todo")}
        backgroundColor="#FAC3FF"
        hoverColor="#BB70C2"
      />
      <SectionAccordion
        status="In-Progress"
        expanded={expanded.inProgress}
        tasks={sortTasks(filteredTasks("IN-PROGRESS"))}
        onAccordionChange={() => handleAccordionChange("inProgress")}
        backgroundColor="#85D9F1"
        hoverColor="#67A0B1"
      />
      <SectionAccordion
        status="Completed"
        expanded={expanded.completed}
        tasks={sortTasks(filteredTasks("COMPLETED"))}
        onAccordionChange={() => handleAccordionChange("completed")}
        backgroundColor="#CEFFCC"
        hoverColor="#A0D59E"
      />
    </div>
  );
};

export default ListView;
