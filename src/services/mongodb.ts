import { Discovery, UserAchievement, UserDiscoveryStats } from '../types/data';

// Mock MongoDB implementation for now
// This will be replaced with actual MongoDB Realm SDK integration

class MongoDBService {
  private isConnected = false;
  private mockDiscoveries: Discovery[] = [];
  private mockAchievements: UserAchievement[] = [];
  private mockStats: Record<string, UserDiscoveryStats> = {};

  constructor() {
    console.log('Initializing MongoDB service (mock)');
    this.initializeMockData();
  }

  private initializeMockData() {
    // Generate some mock discoveries for testing
    this.mockDiscoveries = [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e',
        date: new Date('2023-03-15'),
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          name: 'Golden Gate Park',
        },
        species: {
          name: 'California Poppy (Eschscholzia californica)',
          description: 'The state flower of California, a bright orange flowering plant native to the Pacific coast.',
          rarity: 'Common',
          confidence: 0.92,
          category: 'plant',
          funFact: 'California Poppies close their petals at night or in cold, windy weather.',
        },
        userId: 'user1',
        likes: 12,
        isPublic: true,
        tags: ['flower', 'california', 'orange']
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731',
        date: new Date('2023-02-20'),
        location: {
          latitude: 36.9741,
          longitude: -122.0308,
          name: 'UCSC Arboretum',
        },
        species: {
          name: 'Anna\'s Hummingbird (Calypte anna)',
          description: 'A medium-sized hummingbird with an iridescent bronze-green back and pale grey chest. Males have a rose-pink throat.',
          rarity: 'Rare',
          confidence: 0.86,
          category: 'animal',
          funFact: 'Anna\'s Hummingbirds can fly backwards and are the only birds that can do so.',
        },
        userId: 'user1',
        likes: 23,
        isPublic: true,
        tags: ['bird', 'hummingbird', 'wildlife']
      }
    ];

    // Mock achievements
    this.mockAchievements = [
      {
        id: 'a1',
        name: 'First Discovery',
        description: 'Made your first nature discovery',
        iconName: 'nature',
        dateEarned: new Date('2023-01-10'),
        type: 'milestone'
      },
      {
        id: 'a2',
        name: 'Plant Enthusiast',
        description: 'Discovered 5 different plant species',
        iconName: 'local-florist',
        dateEarned: new Date('2023-02-15'),
        type: 'discovery'
      }
    ];

    // Mock user stats
    this.mockStats['user1'] = {
      totalDiscoveries: 15,
      plants: 8,
      animals: 5,
      fungi: 1,
      geological: 0,
      other: 1,
      rarities: {
        common: 10,
        rare: 4,
        epic: 1
      }
    };
  }

  // Connect to MongoDB
  async connect(): Promise<boolean> {
    try {
      // Mock connection - in real implementation this would connect to MongoDB
      console.log('Connecting to MongoDB...');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      this.isConnected = true;
      console.log('MongoDB connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Disconnect from MongoDB
  async disconnect(): Promise<void> {
    console.log('Disconnecting from MongoDB...');
    this.isConnected = false;
  }

  // Check if connected
  isConnectedToMongoDB(): boolean {
    return this.isConnected;
  }

  // Get user discoveries
  async getUserDiscoveries(userId: string): Promise<Discovery[]> {
    if (!this.isConnected) await this.connect();
    return this.mockDiscoveries.filter(d => d.userId === userId);
  }

  // Get public discoveries
  async getPublicDiscoveries(limit = 10): Promise<Discovery[]> {
    if (!this.isConnected) await this.connect();
    return this.mockDiscoveries.filter(d => d.isPublic).slice(0, limit);
  }

  // Add a new discovery
  async addDiscovery(discovery: Omit<Discovery, 'id'>): Promise<Discovery> {
    if (!this.isConnected) await this.connect();
    
    const newDiscovery: Discovery = {
      ...discovery,
      id: `disc_${Date.now()}`,
      likes: 0
    };
    
    this.mockDiscoveries.push(newDiscovery);
    
    // Update user stats
    await this.updateUserStats(discovery.userId, discovery.species?.category || 'other', discovery.species?.rarity || 'Common');
    
    return newDiscovery;
  }

  // Get user achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    if (!this.isConnected) await this.connect();
    return this.mockAchievements;
  }

  // Get user stats
  async getUserStats(userId: string): Promise<UserDiscoveryStats> {
    if (!this.isConnected) await this.connect();
    return this.mockStats[userId] || {
      totalDiscoveries: 0,
      plants: 0,
      animals: 0,
      fungi: 0,
      geological: 0,
      other: 0,
      rarities: {
        common: 0,
        rare: 0,
        epic: 0
      }
    };
  }

  // Update user stats when a new discovery is added
  private async updateUserStats(
    userId: string, 
    category: 'plant' | 'animal' | 'fungus' | 'geological' | 'other', 
    rarity: 'Common' | 'Rare' | 'Epic'
  ): Promise<void> {
    if (!this.mockStats[userId]) {
      this.mockStats[userId] = {
        totalDiscoveries: 0,
        plants: 0,
        animals: 0,
        fungi: 0,
        geological: 0,
        other: 0,
        rarities: {
          common: 0,
          rare: 0,
          epic: 0
        }
      };
    }
    
    // Update total count
    this.mockStats[userId].totalDiscoveries++;
    
    // Update category count
    this.mockStats[userId][category]++;
    
    // Update rarity count
    this.mockStats[userId].rarities[rarity.toLowerCase() as 'common' | 'rare' | 'epic']++;
  }
}

// Create and export a singleton instance
const mongoDBService = new MongoDBService();
export default mongoDBService; 