import type { EnergyItem, Category } from '../types';

// Design-aligned categories (statuses)
export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Backlog', color: '#6F6471', icon: 'book' },
  { id: '2', name: 'In Progress', color: '#6B4EFF', icon: 'briefcase' },
  { id: '3', name: 'On Hold', color: '#817A87', icon: 'user' },
  { id: '4', name: 'Completed', color: '#4B4B4B', icon: 'heart' },
];

// Sample quests/tasks
export const MOCK_ITEMS: EnergyItem[] = [
  {
    id: '1',
    name: 'Design TuDu',
    category: 'In Progress',
    energyLevel: 3, // used as badge count for now
    description: 'Created: 20/10/2025\nDeadline: 07/11/2025',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-11-07'),
  },
   {
    id: '2',
    name: 'Design TuDu 2',
    category: 'In Progress',
    energyLevel: 3, // used as badge count for now
    description: 'Created: 20/10/2025\nDeadline: 07/11/2025',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-11-07'),
  },
  {
    id: '3',
    name: 'Design TuDu 3',
    category: 'In Progress',
    energyLevel: 3, // used as badge count for now
    description: 'Created: 20/10/2025\nDeadline: 07/11/2025',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-11-07'),
  },
];
