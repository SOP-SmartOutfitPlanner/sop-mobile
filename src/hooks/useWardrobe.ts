import { useState, useMemo } from "react";
import { WardrobeItem } from "../types";

// Mock wardrobe data
const mockWardrobeItems: WardrobeItem[] = [
  {
    id: "1",
    name: "White Sneakers",
    type: "shoes",
    brand: "Adidas",
    color: "#FFFFFF",
    seasons: ["spring", "summer"],
    occasions: ["casual"],
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
    purchaseDate: "2024-01-01",
    price: 120,
    wearCount: 18,
    lastWorn: "16/1/2024",
    tags: ["comfortable", "versatile"],
    isFavorite: false,
  },
  {
    id: "2",
    name: "Classic White Shirt",
    type: "top",
    brand: "Everlane",
    color: "#FFFFFF",
    seasons: ["spring", "summer", "fall"],
    occasions: ["work", "formal"],
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f37f82a7?w=300&h=400&fit=crop",
    purchaseDate: "2024-01-01",
    price: 80,
    wearCount: 12,
    lastWorn: "15/1/2024",
    tags: ["classic", "versatile"],
    isFavorite: true,
  },
  {
    id: "3",
    name: "Silver Watch",
    type: "accessory",
    brand: "Casio",
    color: "#C0C0C0",
    seasons: ["spring", "summer", "fall", "winter"],
    occasions: ["work", "formal", "casual"],
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop",
    purchaseDate: "2024-01-01",
    price: 200,
    wearCount: 14,
    lastWorn: "15/1/2024",
    tags: ["elegant", "daily"],
    isFavorite: false,
  },
  {
    id: "4",
    name: "Gold Chain",
    type: "accessory",
    brand: "Mejuri",
    color: "#FFD700",
    seasons: ["spring", "summer", "fall", "winter"],
    occasions: ["party", "formal"],
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop",
    purchaseDate: "2024-01-01",
    price: 150,
    wearCount: 20,
    lastWorn: "14/1/2024",
    tags: ["luxury", "statement"],
    isFavorite: true,
  },
];

export const useWardrobe = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredItems = useMemo(() => {
    return mockWardrobeItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some(
          (filter) =>
            item.type === filter ||
            item.seasons.includes(filter as any) ||
            item.occasions.includes(filter as any)
        );

      return matchesSearch && matchesFilters;
    });
  }, [searchQuery, selectedFilters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return {
    items: filteredItems,
    allItems: mockWardrobeItems,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    toggleFilter,
    clearFilters,
    loading,
    isRefreshing,
    handleRefresh,
  };
};