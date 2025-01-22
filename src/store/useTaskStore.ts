import { create } from "zustand";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  attachment: File | null;
}

interface Store {
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;

  // Task-related data
  taskData: Task;
  tasks: Task[];

  // Filters and search
  categoryFilter: string;
  dueDateFilter: string;
  searchQuery: string;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (taskId: number) => void;
  closeEditModal: () => void;

  // Task actions
  setTaskData: (data: Partial<Task>) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTaskStatus: (taskId: number, newStatus: string) => void;

  // Filter actions
  setCategoryFilter: (category: string) => void;
  setDueDateFilter: (dueDate: string) => void;
  setSearchQuery: (query: string) => void;
}

const useTaskStore = create<Store>((set, get) => ({
  // Initial states
  isCreateModalOpen: false,
  isEditModalOpen: false,
  taskData: {
    id: 0,
    title: "",
    description: "",
    category: "Work",
    dueDate: "",
    status: "",
    attachment: null,
  },
  tasks: [],
  categoryFilter: "",
  dueDateFilter: "",
  searchQuery: "",

  // Modal actions
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (taskId) => {
    const task = get().tasks.find((task) => task.id === taskId);
    if (task) {
      set({ isEditModalOpen: true, taskData: { ...task } });
    }
  },
  closeEditModal: () => set({ isEditModalOpen: false }),

  // Task actions
  setTaskData: (data) =>
    set((state) => ({
      taskData: { ...state.taskData, ...data },
    })),
  addTask: (task) =>
    set((state) => {
      const taskExists = state.tasks.some(
        (t) => t.title === task.title && t.dueDate === task.dueDate
      );

      if (taskExists) {
        // Update existing task
        const updatedTasks = state.tasks.map((t) =>
          t.title === task.title && t.dueDate === task.dueDate
            ? { ...t, ...task }
            : t
        );
        return { tasks: updatedTasks };
      } else {
        // Add new task
        return { tasks: [...state.tasks, { ...task, id: Date.now() }] };
      }
    }),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),

  // Filter actions
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setDueDateFilter: (dueDate) => set({ dueDateFilter: dueDate }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useTaskStore;
