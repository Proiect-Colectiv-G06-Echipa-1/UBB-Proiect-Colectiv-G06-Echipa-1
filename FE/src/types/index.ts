export interface EnergyItem {
  id: string;
  name: string;
  category: string;
  energyLevel: number; // 0-100
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CreateEditFormData {
  name: string;
  category: string;
  energyLevel: number;
  description: string;
}
