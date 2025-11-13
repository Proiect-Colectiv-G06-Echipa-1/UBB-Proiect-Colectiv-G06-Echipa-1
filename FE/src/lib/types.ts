import { z } from 'zod';

export const taskStatuses = ['To Do', 'In Progress', 'Done'] as const;
export type TaskStatus = typeof taskStatuses[number];

export interface Task {
  id: string;
  energy: number; 
  title: string;
  description: string;
  createdDate: string; 
  deadline: string;    
  status: TaskStatus;
}

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  
  energy: z.coerce
    .number()
    .int()
    .min(1, 'Energy must be at least 1'),

  description: z.string().optional(),
  status: z.enum(taskStatuses),
  createdDate: z.string().date('Invalid creation date'),
  deadline: z.string().date('Invalid deadline'),
})
.refine((data) => {
  const created = new Date(data.createdDate);
  const deadline = new Date(data.deadline);
  return deadline >= created;
}, {
  message: "Deadline cannot be before Created Date",
  path: ["deadline"], 
});

export type TaskFormData = z.infer<typeof taskSchema>;

export interface TreeNode {
  id: string;
  energy: number;
  title: string;
  created: string;  
  deadline: string;
  children?: TreeNode[]; 
}