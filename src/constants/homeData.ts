// Home Screen Data Constants
export const OUTFIT_DATA = {
  matchScore: "92% match score",
  weatherDescription: "Perfect for 22°, partly cloudy",
  items: [
    {
      id: 1,
      name: "Classic White Shirt",
      imageUri: "https://images.unsplash.com/photo-1583743814966-8936f37f82a7?w=100&h=100&fit=crop",
      isCenter: false,
    },
    {
      id: 2,
      name: "Center Item",
      imageUri: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=150&fit=crop",
      isCenter: true,
    },
    {
      id: 3,
      name: "Black Ankle Boots",
      imageUri: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
      isCenter: false,
    },
  ],
  tags: [
    { text: "Smart casual", style: "smart" as const },
    { text: "Weather-ready", style: "weather" as const },
  ],
};

export const CHALLENGE_DATA = {
  label: "WEEKLY CHALLENGE",
  title: "Mix & Match Monday",
  description: "Create 3 different looks using only 5 pieces from your wardrobe",
  backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  gradientColors: ['rgba(139, 69, 19, 0.8)', 'rgba(160, 82, 45, 0.6)'],
  stats: [
    { value: "250", label: "points" },
    { value: "2.3k", label: "joined" },
    { value: "5", label: "days left" }
  ],
};

export const FAVORITES_DATA = [
  {
    id: 1,
    label: "🌸Spring Casual",
    title: "Spring Cas...",
    imageUri: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=120&fit=crop",
  },
  {
    id: 2,
    title: "Work Chic",
    imageUri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=120&fit=crop",
  },
  {
    id: 3,
    title: "Weekend V...",
    imageUri: "https://images.unsplash.com/photo-1506629905607-47c4e2ee4e91?w=100&h=120&fit=crop",
  },
];

export const COMMUNITY_POST = {
  user: {
    initials: "SC",
    name: "Sarah Chen",
    timeAgo: "2 hours ago",
  },
  content: "My go-to autumn palette 🍂 What do you think?",
  imageUri: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
  stats: {
    likes: "124",
    comments: "18",
  },
};

export const NAVIGATION_ITEMS = [
  { id: "wardrobe", icon: "wardrobe", title: "Wardrobe", route: "Wardrobe" },
  { id: "planner", icon: "planner", title: "Planner", route: "Planner" },
  { id: "favorites", icon: "favorites", title: "Favorites", route: "Collection" },
  { id: "collections", icon: "collections", title: "Collections", route: "Community" },
];