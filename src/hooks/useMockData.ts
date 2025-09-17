import { useState, useEffect } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Weather {
  temp: number;
  condition: string;
  feelsLike: number;
  rainChance: number;
  uv: number;
  location: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  dressCode: string;
  type: 'meeting' | 'event' | 'appointment' | 'social';
}

export interface OutfitItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
  color: string;
  brand?: string;
  imageUrl: string;
  tags: string[];
}

export interface DailyOutfit {
  id: string;
  items: OutfitItem[];
  score: number;
  occasion: string;
  weather: string;
  createdAt: string;
}

// Mock Data
const mockUser: User = {
  id: '1',
  name: 'Maya Johnson',
  email: 'maya.johnson@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
};

const mockWeather: Weather = {
  temp: 22,
  condition: 'Sunny',
  feelsLike: 24,
  rainChance: 10,
  uv: 6,
  location: 'New York, NY',
};

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    time: '9:00 AM',
    location: 'Conference Room A',
    dressCode: 'Smart',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    time: '12:30 PM',
    location: 'Downtown Cafe',
    dressCode: 'Casual',
    type: 'social',
  },
  {
    id: '3',
    title: 'Gym Session',
    time: '6:00 PM',
    location: 'Fitness Center',
    dressCode: 'Sport',
    type: 'appointment',
  },
  {
    id: '4',
    title: 'Dinner Date',
    time: '8:00 PM',
    location: 'The Rooftop',
    dressCode: 'Formal',
    type: 'social',
  },
];

const mockOutfitItems: OutfitItem[] = [
  {
    id: '1',
    name: 'White Button-up Shirt',
    category: 'top',
    color: 'white',
    brand: 'Uniqlo',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
    tags: ['professional', 'versatile', 'cotton'],
  },
  {
    id: '2',
    name: 'Navy Blue Blazer',
    category: 'outerwear',
    color: 'navy',
    brand: 'Zara',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop',
    tags: ['formal', 'business', 'structured'],
  },
  {
    id: '3',
    name: 'Black Dress Pants',
    category: 'bottom',
    color: 'black',
    brand: 'H&M',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
    tags: ['formal', 'slim-fit', 'professional'],
  },
  {
    id: '4',
    name: 'Brown Leather Shoes',
    category: 'shoes',
    color: 'brown',
    brand: 'Cole Haan',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    tags: ['leather', 'formal', 'comfortable'],
  },
  {
    id: '5',
    name: 'Denim Jeans',
    category: 'bottom',
    color: 'blue',
    brand: 'Levi\'s',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
    tags: ['casual', 'denim', 'comfortable'],
  },
  {
    id: '6',
    name: 'Casual T-Shirt',
    category: 'top',
    color: 'gray',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    tags: ['casual', 'comfortable', 'cotton'],
  },
];

const mockDailyOutfit: DailyOutfit = {
  id: '1',
  items: [mockOutfitItems[0], mockOutfitItems[1], mockOutfitItems[2]], // White shirt, navy blazer, black pants
  score: 92,
  occasion: 'Business Meeting',
  weather: 'Sunny, 22°C',
  createdAt: new Date().toISOString(),
};

// Custom Hooks
export const useCurrentUser = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    loading,
    error,
    updateUser: setUser,
  };
};

export const useWeather = () => {
  const [data, setData] = useState<Weather>(mockWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate weather updates
  useEffect(() => {
    const updateWeather = () => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const baseTemp = 22;
      const tempVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
      
      setData(prev => ({
        ...prev,
        temp: baseTemp + tempVariation,
        condition: randomCondition,
        feelsLike: baseTemp + tempVariation + 2,
        rainChance: randomCondition === 'Rainy' ? 80 : Math.floor(Math.random() * 30),
      }));
    };

    // Update weather every 30 seconds (for demo purposes)
    const interval = setInterval(updateWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshWeather = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate API call
      setLoading(false);
    }, 1000);
  };

  return {
    data,
    loading,
    error,
    refresh: refreshWeather,
  };
};

export const useSchedule = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>(mockEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's events
  const todayEvents = events.filter(event => {
    // In a real app, you'd filter by actual date
    return true;
  });

  // Get upcoming events (next 3 hours)
  const upcomingEvents = events.slice(0, 2);

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<ScheduleEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return {
    events: todayEvents,
    upcomingEvents,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};

export const useDailyOutfit = () => {
  const [main, setMain] = useState<DailyOutfit>(mockDailyOutfit);
  const [alternatives, setAlternatives] = useState<DailyOutfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOutfit = (occasion?: string, weather?: string) => {
    setLoading(true);
    
    // Simulate AI outfit generation
    setTimeout(() => {
      const randomItems = mockOutfitItems
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const newOutfit: DailyOutfit = {
        id: Date.now().toString(),
        items: randomItems,
        score: Math.floor(Math.random() * 20) + 80, // 80-100
        occasion: occasion || 'General',
        weather: weather || mockWeather.condition,
        createdAt: new Date().toISOString(),
      };
      
      setMain(newOutfit);
      setLoading(false);
    }, 1500);
  };

  const generateAlternatives = () => {
    setLoading(true);
    
    setTimeout(() => {
      const alts: DailyOutfit[] = Array.from({ length: 3 }, (_, index) => ({
        id: `alt-${index}`,
        items: mockOutfitItems
          .sort(() => Math.random() - 0.5)
          .slice(0, 3),
        score: Math.floor(Math.random() * 15) + 75, // 75-90
        occasion: main.occasion,
        weather: main.weather,
        createdAt: new Date().toISOString(),
      }));
      
      setAlternatives(alts);
      setLoading(false);
    }, 1000);
  };

  const saveOutfit = (outfit: DailyOutfit) => {
    // In a real app, save to storage/database
    console.log('Outfit saved:', outfit);
  };

  return {
    main,
    alternatives,
    loading,
    error,
    generateOutfit,
    generateAlternatives,
    saveOutfit,
  };
};

export const useWardrobe = () => {
  const [items, setItems] = useState<OutfitItem[]>(mockOutfitItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = (item: Omit<OutfitItem, 'id'>) => {
    const newItem: OutfitItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<OutfitItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsByCategory = (category: OutfitItem['category']) => {
    return items.filter(item => item.category === category);
  };

  const searchItems = (query: string) => {
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    searchItems,
  };
};

// Additional utility hooks
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // In React Native, you'd use AsyncStorage here
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // In React Native, you'd use AsyncStorage here
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};