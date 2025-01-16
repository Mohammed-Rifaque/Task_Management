import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import useTaskStore from "../../../store/useTaskStore";

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

const TaskCard = ({ task, id }: { task: Task; id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: "transform 250ms ease", // Smooth drag transition
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-4 bg-gray-200 rounded shadow"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description || "No description"}</p>
      <p className="text-xs text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
    </div>
  );
};

const DroppableColumn = ({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-white p-4 rounded shadow"
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <SortableContext
        items={tasks.map((task) => task.id.toString())} // Use task.id as the unique key
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id.toString()} task={task} id={task.id.toString()} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const BoardView = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const [columns, setColumns] = useState({
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    COMPLETED: tasks.filter((task) => task.status === "COMPLETED"),
  });

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
        [destinationColumnKey]: updatedDestinationColumn,
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 p-4 bg-gray-100">
        {Object.entries(columns).map(([columnId, tasks]) => (
          <DroppableColumn key={columnId} id={columnId} title={columnId} tasks={tasks} />
        ))}
      </div>
    </DndContext>
  );
};

export default BoardView;
