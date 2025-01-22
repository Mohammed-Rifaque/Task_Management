export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: "pending" | "completed";
  description?: string;
  tags?: string[];
  attachment: File | string;
}
