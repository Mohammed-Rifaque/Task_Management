import React, { useEffect, useRef, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import useTaskStore from "../../../store/useTaskStore";
import Filter from "./Filter";
import { Button, Menu, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// Define Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  attachment: string | File | null;
}

const TaskCard = ({ task, id, index }: { task: Task; id: string; index: number }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const { openEditModal, deleteTask } = useTaskStore();

  // Fixing state for each dropdown
  const [actionDropDown, setActionDropDown] = useState<{ [key: number]: boolean }>({});

  // Creating a ref for each action button using a Map to handle refs by task ID
  const actionButtonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: "transform 250ms ease"
  };

  const handleActionClick = (taskId: number) => {
    setActionDropDown((prev) => ({
      ...prev,
      [taskId]: !prev[taskId] // Toggling visibility of menu for the clicked task
    }));
  };

  const handleEdit = (taskId: number) => {
    setActionDropDown((prev) => {
      const updatedDropDown = { ...prev };
      Object.keys(updatedDropDown).forEach((key) => {
        updatedDropDown[Number(key)] = false; // Close all other menus
      });
      return updatedDropDown;
    });
    openEditModal(taskId);
  };

  const handleDelete = (taskId: number) => {
    deleteTask(taskId);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-4 bg-white rounded-xl shadow h-36 flex flex-col justify-between">
      <div className="flex justify-between">
        <h3 className="font-semibold text-black">{task.title}</h3>
        <div>
          <Typography onClick={() => handleActionClick(task.id)}>
            <Button
              ref={(el) => { 
                // Store the ref in the Map for this task
                actionButtonRefs.current.set(task.id, el); 
              }}
              sx={{display: "flex", alignItems: "center", justifyContent: "end"}}
            >
              <MoreHorizIcon className="text-gray-500" />
            </Button>
          </Typography>
          <Menu
            open={actionDropDown[task.id]}
            onClose={() => setActionDropDown((prev) => ({ ...prev, [task.id]: false }))}
            anchorEl={actionButtonRefs.current.get(task.id) || null} // Using .current for the DOM element
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
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-xs text-gray-500">{task.category}</p>
        <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex-1 bg-[#F1F1F1] min-h-screen p-4 rounded-xl shadow-md">
      <button
        className={`text-gray-900 font-medium p-2 rounded-lg ${
          title === "TO-DO" ? "bg-[#FAC3FF]" : title === "IN-PROGRESS" ? "bg-[#85D9F1]" : title === "COMPLETED" ? "bg-[#A2D6A0]" : ""
        }`}>
        {title}
      </button>

      <SortableContext items={tasks.map((task) => task.id.toString())} strategy={verticalListSortingStrategy}>
        {tasks.length > 0 ? (
          <div className="space-y-4 mt-4">
            {tasks.map((task, index) => (
              <TaskCard key={task.id.toString()} task={task} id={task.id.toString()} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <p>No Tasks in {title}</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const BoardView = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [columns, setColumns] = useState({
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    COMPLETED: tasks.filter((task) => task.status === "COMPLETED")
  });
  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find source and destination columns
    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key as keyof typeof columns].some((task) => task.id.toString() === active.id)
    ) as keyof typeof columns;

    const destinationColumnKey = over.id as keyof typeof columns;

    if (sourceColumnKey && destinationColumnKey) {
      const sourceColumn = [...columns[sourceColumnKey]];
      const destinationColumn = [...columns[destinationColumnKey]];

      const movingTask = sourceColumn.find((task) => task.id.toString() === active.id);
      if (!movingTask) return;

      // Update task's status in the store
      useTaskStore.getState().updateTaskStatus(movingTask.id, destinationColumnKey); // Update task status

      // Remove task from source column
      const updatedSourceColumn = sourceColumn.filter((task) => task.id.toString() !== active.id);

      // Add task to destination column
      const updatedDestinationColumn = [...destinationColumn, movingTask];

      setColumns({
        ...columns,
        [sourceColumnKey]: updatedSourceColumn,
        [destinationColumnKey]: updatedDestinationColumn
      });
    }
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

  return (
    <>
      <Filter
        handleCategoryChange={handleCategoryChange}
        handleDueDateChange={handleDueDateChange}
        handleSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        dueDateFilter={dueDateFilter}
        searchQuery={searchQuery}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 gap-2 p-4 w-10/12">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <DroppableColumn key={columnId} id={columnId} title={columnId} tasks={tasks} />
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default BoardView;
