import {create} from 'zustand';  

interface Task {  
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
  openModal: () => void;  
  closeModal: () => void;  
  setTaskData: (data: Partial<Task>) => void;  
}  

const useTaskStore = create<Store>((set) => ({  
  isModalOpen: false,  
  taskData: {  
    title: '',  
    description: '',  
    category: 'Work',  
    dueDate: '',  
    status: '',  
    attachment: null,  
  },  
  openModal: () => set({ isModalOpen: true }),  
  closeModal: () => set({ isModalOpen: false }),  
  setTaskData: (data) => set((state) => ({ taskData: { ...state.taskData, ...data } })),  
}));  

export default useTaskStore;