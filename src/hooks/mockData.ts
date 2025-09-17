import { WardrobeItem } from "../types";

// Mock wardrobe items
export const mockWardrobeItems: WardrobeItem[] = [
  {
    id: "1",
    name: "Blue Denim Jacket",
    type: "jacket",
    brand: "Levi's",
    color: "blue",
    seasons: ["spring", "fall"],
    occasions: ["casual", "weekend"],
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop",
    purchaseDate: "2023-03-15",
    price: 89.99,
    wearCount: 15,
    lastWorn: "2024-01-10",
    tags: ["denim", "classic", "versatile"],
    notes: "Perfect for layering in cooler weather",
    isFavorite: true,
  },
  {
    id: "2",
    name: "White Cotton T-Shirt",
    type: "top",
    brand: "Uniqlo",
    color: "white",
    seasons: ["spring", "summer", "fall"],
    occasions: ["casual", "gym", "weekend"],
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
    purchaseDate: "2023-06-20",
    price: 19.99,
    wearCount: 32,
    lastWorn: "2024-01-12",
    tags: ["basic", "cotton", "comfortable"],
    notes: "Essential wardrobe staple",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Black Skinny Jeans",
    type: "bottom",
    brand: "Zara",
    color: "black",
    seasons: ["fall", "winter", "spring"],
    occasions: ["casual", "work", "date"],
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop",
    purchaseDate: "2023-01-10",
    price: 45.99,
    wearCount: 28,
    lastWorn: "2024-01-08",
    tags: ["skinny", "stretchy", "versatile"],
    notes: "Goes with everything",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Red Floral Dress",
    type: "dress",
    brand: "H&M",
    color: "red",
    seasons: ["spring", "summer"],
    occasions: ["date", "party", "brunch"],
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
    purchaseDate: "2023-04-22",
    price: 39.99,
    wearCount: 8,
    lastWorn: "2023-12-15",
    tags: ["floral", "feminine", "midi"],
    notes: "Perfect for spring dates",
    isFavorite: true,
  },
  {
    id: "5",
    name: "Black Leather Boots",
    type: "shoes",
    brand: "Dr. Martens",
    color: "black",
    seasons: ["fall", "winter", "spring"],
    occasions: ["casual", "work", "edgy"],
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
    purchaseDate: "2022-11-05",
    price: 149.99,
    wearCount: 45,
    lastWorn: "2024-01-11",
    tags: ["leather", "durable", "edgy"],
    notes: "Investment piece, very comfortable",
    isFavorite: true,
  },
  {
    id: "6",
    name: "Grey Wool Sweater",
    type: "top",
    brand: "COS",
    color: "grey",
    seasons: ["fall", "winter"],
    occasions: ["work", "casual", "cozy"],
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
    purchaseDate: "2023-09-12",
    price: 79.99,
    wearCount: 12,
    lastWorn: "2024-01-05",
    tags: ["wool", "warm", "minimalist"],
    notes: "Perfect for office wear",
    isFavorite: false,
  },
  {
    id: "7",
    name: "Navy Blue Blazer",
    type: "jacket",
    brand: "J.Crew",
    color: "navy",
    seasons: ["spring", "fall", "winter"],
    occasions: ["work", "formal", "interview"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    purchaseDate: "2023-02-28",
    price: 159.99,
    wearCount: 18,
    lastWorn: "2024-01-09",
    tags: ["blazer", "professional", "tailored"],
    notes: "Essential for work meetings",
    isFavorite: false,
  },
  {
    id: "8",
    name: "White Sneakers",
    type: "shoes",
    brand: "Adidas",
    color: "white",
    seasons: ["spring", "summer", "fall"],
    occasions: ["casual", "gym", "weekend"],
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop",
    purchaseDate: "2023-05-10",
    price: 89.99,
    wearCount: 35,
    lastWorn: "2024-01-13",
    tags: ["comfortable", "sporty", "clean"],
    notes: "Great for everyday wear",
    isFavorite: true,
  },
];

// Mock wardrobe goals
export const mockWardrobeGoals = [
  {
    id: "1",
    title: "Sustainable Shopping",
    description: "Buy only 5 new items this year",
    progress: 2,
    target: 5,
    category: "sustainability",
  },
  {
    id: "2",
    title: "Wear Everything",
    description: "Wear each item at least once this season",
    progress: 75,
    target: 100,
    category: "utilization",
  },
  {
    id: "3",
    title: "Declutter Challenge",
    description: "Remove 10 unworn items",
    progress: 6,
    target: 10,
    category: "organization",
  },
];

// Mock wardrobe stats
export const mockWardrobeStats = {
  totalItems: 128,
  totalValue: 2450.75,
  averageWearCount: 12,
  mostWornCategory: "tops",
  sustainabilityScore: 85,
  costPerWear: 8.45,
  monthlySpending: 145.50,
  favoriteItems: 24,
};

// Mock type distribution
export const mockTypeDistribution = [
  { type: "tops", count: 35, percentage: 27 },
  { type: "bottoms", count: 28, percentage: 22 },
  { type: "dresses", count: 18, percentage: 14 },
  { type: "jackets", count: 15, percentage: 12 },
  { type: "shoes", count: 22, percentage: 17 },
  { type: "accessories", count: 10, percentage: 8 },
];

// Mock popular colors
export const mockPopularColors = [
  { color: "black", count: 32, hex: "#000000" },
  { color: "white", count: 28, hex: "#FFFFFF" },
  { color: "navy", count: 18, hex: "#000080" },
  { color: "grey", count: 15, hex: "#808080" },
  { color: "blue", count: 12, hex: "#0066CC" },
  { color: "red", count: 8, hex: "#FF0000" },
];

// Mock most worn items
export const mockMostWornItems = [
  {
    id: "2",
    name: "White Cotton T-Shirt",
    wearCount: 32,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
    category: "tops",
  },
  {
    id: "8",
    name: "White Sneakers",
    wearCount: 35,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop",
    category: "shoes",
  },
  {
    id: "3",
    name: "Black Skinny Jeans",
    wearCount: 28,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop",
    category: "bottoms",
  },
  {
    id: "5",
    name: "Black Leather Boots",
    wearCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
    category: "shoes",
  },
];

// Mock declutter hints
export const mockDeclutterHints = [
  {
    id: "1",
    title: "Unworn for 6+ months",
    description: "These items haven't been worn recently",
    itemCount: 12,
    priority: "medium",
    actionSuggestion: "Consider donating or storing seasonally",
  },
  {
    id: "2",
    title: "Duplicate basics",
    description: "You have multiple similar items",
    itemCount: 8,
    priority: "low",
    actionSuggestion: "Keep your favorites, donate the rest",
  },
  {
    id: "3",
    title: "Poor condition items",
    description: "Items with visible wear or damage",
    itemCount: 5,
    priority: "high",
    actionSuggestion: "Repair or replace these items",
  },
  {
    id: "4",
    title: "Wrong size",
    description: "Items that no longer fit properly",
    itemCount: 3,
    priority: "high",
    actionSuggestion: "Donate or alter to fit better",
  },
];

// Mock outfit suggestions
export const mockOutfitSuggestions = [
  {
    id: "1",
    name: "Casual Weekend",
    items: ["2", "3", "8"], // White T-shirt, Black jeans, White sneakers
    occasion: "casual",
    weather: "mild",
    style: "comfortable",
  },
  {
    id: "2",
    name: "Work Professional",
    items: ["7", "3", "5"], // Navy blazer, Black jeans, Black boots
    occasion: "work",
    weather: "cool",
    style: "professional",
  },
  {
    id: "3",
    name: "Date Night",
    items: ["4", "5"], // Red dress, Black boots
    occasion: "date",
    weather: "warm",
    style: "romantic",
  },
];

// Mock weather data
export const mockWeatherData = {
  current: {
    temperature: 22,
    condition: "partly cloudy",
    humidity: 65,
    windSpeed: 12,
  },
  forecast: [
    { day: "Today", high: 24, low: 18, condition: "sunny" },
    { day: "Tomorrow", high: 21, low: 16, condition: "cloudy" },
    { day: "Wednesday", high: 19, low: 14, condition: "rainy" },
  ],
};

// Mock categories and filters
export const mockCategories = [
  "tops",
  "bottoms", 
  "dresses",
  "jackets",
  "shoes",
  "accessories",
];

export const mockSeasons = [
  "spring",
  "summer", 
  "fall",
  "winter",
];

export const mockOccasions = [
  "casual",
  "work",
  "formal",
  "party",
  "gym",
  "date",
  "weekend",
  "travel",
];

export const mockColors = [
  "black",
  "white",
  "grey",
  "navy",
  "blue",
  "red",
  "green",
  "yellow",
  "pink",
  "purple",
  "brown",
  "beige",
];

export const mockBrands = [
  "Zara",
  "H&M",
  "Uniqlo",
  "Nike",
  "Adidas",
  "Levi's",
  "J.Crew",
  "COS",
  "Mango",
  "ASOS",
];