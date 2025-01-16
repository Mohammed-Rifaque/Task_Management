import { create } from 'zustand';

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
  isModalOpen: boolean;
  taskData: Task;
  tasks: Task[];
  categoryFilter: string;
  dueDateFilter: string;
  searchQuery: string;
  
  // Actions
  openModal: () => void;
  closeModal: () => void;
  setTaskData: (data: Partial<Task>) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: number, newStatus: string) => void;

  // Filter actions
  setCategoryFilter: (category: string) => void;
  setDueDateFilter: (dueDate: string) => void;
  setSearchQuery: (query: string) => void;
}

const useTaskStore = create<Store>((set) => ({
  isModalOpen: false,
  taskData: {
    id: 0,
    title: '',
    description: '',
    category: 'Work',
    dueDate: '',
    status: '',
    attachment: null,
  },
  tasks: [],
  categoryFilter: '',
  dueDateFilter: '',
  searchQuery: '',

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setTaskData: (data) =>
    set((state) => ({
      taskData: { ...state.taskData, ...data },
    })),
  addTask: (task) =>
    set((state) => {
      const newTask = { ...task, id: task.id || Date.now() };
      return { tasks: [...state.tasks, newTask] };
    }),
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
