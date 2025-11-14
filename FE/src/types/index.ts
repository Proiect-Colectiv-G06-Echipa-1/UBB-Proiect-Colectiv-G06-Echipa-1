export interface EnergyItem {
  id: string;
  name: string;
  category: string;
  energyLevel: number; // 0-10
  description: string;
  createdAt: Date;
  deadline: Date;
  dependencies: string[];
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
  createdAt: Date;
  deadline: Date;
  dependencies: string[];
}
