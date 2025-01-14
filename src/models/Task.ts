export interface Task {
    id: string;
    title: string;
    category: string;
    dueDate: string; // ISO 8601 date string
    status: 'pending' | 'completed';
    description?: string;
    tags?: string[];
    attachments?: string[];
  }
  