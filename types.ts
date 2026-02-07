export interface LaitStructure {
  base: string;
  note: string;
  finish: string;
}

export interface Dish {
  id: string;
  title: string;
  sentenceA: string; // Max 22 chars
  sentenceB: string; // Max 30 chars
  laitStructure: LaitStructure;
  imageKey: number; // For picsum randomness
  badges: string[];
}

export interface Theme {
  id: string;
  name: string; // Max 6 chars
  tagline: string; // Max 14 chars
  imageKey: number; // Thumbnail image for the tab
  dishes: Dish[];
}

export interface NavItem {
  id: string;
  label: string;
}