export interface WardrobeItem {
  id: string;
  name: string;
  type: string;
  brand?: string;
  color: string;
  seasons: Season[];
  occasions: Occasion[];
  imageUrl: string;
  purchaseDate: string;
  price: number;
  wearCount: number;
  lastWorn: string;
  tags: string[];
  notes?: string;
  isFavorite: boolean;
}

export type Season = "spring" | "summer" | "fall" | "winter";
export type Occasion = "casual" | "work" | "formal" | "party" | "gym" | "date" | "weekend" | "travel";

export interface WardrobeGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
}

export interface WardrobeStats {
  totalItems: number;
  totalValue: number;
  averageWearCount: number;
  mostWornCategory: string;
  sustainabilityScore: number;
  costPerWear: number;
  monthlySpending: number;
  favoriteItems: number;
}

export interface TypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface PopularColor {
  color: string;
  count: number;
  hex: string;
}

export interface MostWornItem {
  id: string;
  name: string;
  wearCount: number;
  imageUrl: string;
  category: string;
}

export interface DeclutterHint {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  priority: "low" | "medium" | "high";
  actionSuggestion: string;
}