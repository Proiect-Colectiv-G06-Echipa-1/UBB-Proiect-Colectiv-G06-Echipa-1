import { de } from 'zod/v4/locales';
import type { EnergyItem, Category, CreateEditFormData } from '../types';
import { MOCK_CATEGORIES, MOCK_ITEMS } from './mockData';

// Simulating a delay for production environment
const SIMULATED_DELAY = 500;

let items: EnergyItem[] = JSON.parse(JSON.stringify(MOCK_ITEMS));
let nextId = Math.max(...items.map(item => parseInt(item.id))) + 1;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAll(): Promise<EnergyItem[]> {
  await delay(SIMULATED_DELAY);
  return JSON.parse(JSON.stringify(items.sort((a, b) => 
    new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
  )));
}

export async function getCategories(): Promise<Category[]> {
  await delay(SIMULATED_DELAY);
  return JSON.parse(JSON.stringify(MOCK_CATEGORIES));
}

export async function getEnergyLevel(itemId: string): Promise<number> {
  await delay(SIMULATED_DELAY);
  const item = items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  return item.energyLevel;
}

export async function modifyEnergyLevel(
  itemId: string,
  newEnergyLevel: number
): Promise<EnergyItem> {
  await delay(SIMULATED_DELAY);
  const item = items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  item.energyLevel = Math.max(0, Math.min(100, newEnergyLevel));
  item.deadline = new Date();
  
  return JSON.parse(JSON.stringify(item));
}

export async function createItem(data: CreateEditFormData): Promise<EnergyItem> {
  await delay(SIMULATED_DELAY);
  
  const newItem: EnergyItem = {
    id: String(nextId++),
    name: data.name,
    category: data.category,
    energyLevel: data.energyLevel,
    description: data.description,
    createdAt: data.createdAt,
    deadline: data.deadline,
    dependencies: data.dependencies,
  };
  
  items.push(newItem);
  return JSON.parse(JSON.stringify(newItem));
}

/**
 * Update an existing item
 */
export async function updateItem(
  itemId: string,
  data: CreateEditFormData
): Promise<EnergyItem> {
  await delay(SIMULATED_DELAY);
  
  const item = items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  item.name = data.name;
  item.category = data.category;
  item.energyLevel = data.energyLevel;
  item.description = data.description;
  item.createdAt = data.createdAt;
  item.deadline = data.deadline;
  item.dependencies = data.dependencies;
  
  return JSON.parse(JSON.stringify(item));
}

/**
 * Delete an item
 */
export async function deleteItem(itemId: string): Promise<void> {
  await delay(SIMULATED_DELAY);
  
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) throw new Error('Item not found');
  
  items.splice(index, 1);
}

/**
 * Get items by category
 */
export async function getItemsByCategory(categoryName: string): Promise<EnergyItem[]> {
  await delay(SIMULATED_DELAY);
  return JSON.parse(JSON.stringify(
    items
      .filter(i => i.category === categoryName)
      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
  ));
}
