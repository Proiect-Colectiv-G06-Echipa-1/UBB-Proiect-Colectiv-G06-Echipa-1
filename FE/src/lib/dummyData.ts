import type { Task, TreeNode } from './types';

export const initialTask: Task = {
  id: 'task-101',
  energy: 10, 
  title: 'Raytracer',
  description: 'Implement a basic raytracing engine with sphere intersections and simple lighting.',
  createdDate: '2025-10-10',
  deadline: '2025-11-09',
  status: 'In Progress',
};

export const dummyTreeData: TreeNode = {
  id: 'root-1',
  title: 'Initial Card',
  energy: 5, 
  created: '23/08/2025',
  deadline: '26/08/2025',
  children: [
    {
      id: 'child-1',
      title: 'Raytracer',
      energy: 10, 
      created: '10/10/2025',
      deadline: '09/11/2025',
    },
    {
      id: 'child-2',
      title: 'Other Child',
      energy: 3, 
      created: '10/10/2025',
      deadline: '09/11/2025',
    },
  ],
};