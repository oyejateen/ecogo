// Types for nature discoveries
export type RarityLevel = 'Common' | 'Rare' | 'Epic';

export interface Discovery {
  id: string;
  imageUrl: string;
  date: Date | string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  species?: {
    name: string;
    description: string;
    rarity: RarityLevel;
    confidence: number;
    category: 'plant' | 'animal' | 'fungus' | 'geological' | 'other';
    funFact?: string;
    brainrotDescription?: string;
  };
  userId: string;
  notes?: string;
  likes: number;
  isPublic: boolean;
  tags?: string[];
}

// User collection types
export interface UserDiscoveryStats {
  totalDiscoveries: number;
  plants: number;
  animals: number;
  fungi: number;
  geological: number;
  other: number;
  rarities: {
    common: number;
    rare: number;
    epic: number;
  };
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  dateEarned: Date | string;
  type: 'discovery' | 'social' | 'milestone' | 'special';
}

// Location types
export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

// Activity types for user feed/timeline
export interface Activity {
  id: string;
  type: 'discovery' | 'achievement' | 'like' | 'comment' | 'follow';
  date: Date | string;
  userId: string;
  userName?: string;
  userPhoto?: string;
  data: any; // Union type of possible activity data objects
} 