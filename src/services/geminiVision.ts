import { RarityLevel } from '../types/data';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { GoogleGenAI } from "@google/genai";
import config from '../utils/config';

export interface SpeciesIdentification {
  name: string;
  description: string;
  rarity: RarityLevel;
  confidence: number;
  category: 'plant' | 'animal' | 'fungus' | 'geological' | 'other';
  funFact: string;
  brainrotDescription: string;
}

class GeminiVisionService {
  private readonly apiKey: string;
  private readonly genAI: GoogleGenAI;

  constructor() {
    this.apiKey = config.google.cloudApiKey || '';
    if (!this.apiKey) {
      console.warn('Google Cloud API key is not configured. Using mock data instead.');
    }
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
  }

  private async getBase64FromUri(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  private determineRarity(confidence: number, category: string): RarityLevel {
    if (confidence > 0.95 || category === 'geological') {
      return 'Epic';
    } else if (confidence > 0.85) {
      return 'Rare';
    }
    return 'Common';
  }

  private generateBrainrotDescription(name: string, description: string, category: string): string {
    const emojis = {
      animal: ['🦁', '🐯', '🦊', '🦒', '🦘', '🦛', '🦏', '🐘', '🦍', '🦧', '🐒', '🦜', '🦅', '🦆', '🦢', '🦉', '🦚', '🦃', '🦜', '🦩'],
      plant: ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐', '🌱', '🌳'],
      fungus: ['🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄'],
      geological: ['⛰️', '🗻', '🏔️', '🌋', '🗺️', '💎', '💍', '💠', '🔮', '💫', '✨', '🌟', '⭐', '🌠', '🌌', '🌍', '🌎', '🌏', '🌑', '🌒'],
      other: ['🔍', '🔎', '🔏', '🔐', '🔑', '🔒', '🔓', '🔔', '🔕', '🔖', '🔗', '🔘', '🔙', '🔚', '🔛', '🔜', '🔝', '🔞', '🔟', '🔠']
    };

    const categoryEmojis = emojis[category as keyof typeof emojis] || emojis.other;
    const randomEmojis = Array(3).fill(0).map(() => categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)]).join('');
    
    const brainrotPhrases = [
      "OMG this is literally so",
      "No cause this is actually",
      "This is giving very much",
      "POV: You're a wildlife expert and you just found",
      "This is so underrated!",
      "The way this",
      "This is what dreams are made of!",
      "This is giving very much main character energy",
      "This is so aesthetic!",
      "This is giving very much 'I know what I'm doing' energy"
    ];
    
    const randomPhrase = brainrotPhrases[Math.floor(Math.random() * brainrotPhrases.length)];
    
    return `${randomPhrase} ${randomEmojis} ${name} ${randomEmojis}! The vibes are immaculate and I'm obsessed! ${description.split('.')[0]} ${randomEmojis} This is definitely going in my inspo folder! 10/10 would recommend to a friend!`;
  }

  private generateFunFact(category: string): string {
    const funFacts = {
      animal: [
        "Did you know? Some animals can recognize themselves in mirrors!",
        "Fun fact: The average house cat spends 70% of its life sleeping.",
        "Interesting: Giraffes have the same number of neck vertebrae as humans!",
        "Cool fact: Elephants are the only mammals that can't jump.",
        "Did you know? Penguins can jump up to 6 feet in the air!"
      ],
      plant: [
        "Did you know? Plants can communicate with each other through underground fungal networks!",
        "Fun fact: The world's oldest living plant is over 43,000 years old!",
        "Interesting: Some plants can move to follow the sun across the sky.",
        "Cool fact: Bamboo can grow up to 3 feet in a single day!",
        "Did you know? The smell of freshly cut grass is actually a distress signal!"
      ],
      fungus: [
        "Did you know? The largest living organism on Earth is a fungus!",
        "Fun fact: Some fungi can glow in the dark!",
        "Interesting: Fungi are more closely related to animals than plants!",
        "Cool fact: Some mushrooms can grow overnight!",
        "Did you know? Fungi can break down plastic!"
      ],
      geological: [
        "Did you know? The Earth's core is as hot as the surface of the sun!",
        "Fun fact: Diamonds are made of pure carbon, just like graphite in pencils!",
        "Interesting: The Grand Canyon is still growing!",
        "Cool fact: Some rocks can float on water!",
        "Did you know? The Earth's magnetic field is weakening!"
      ],
      other: [
        "Did you know? The average person spends 6 months of their lifetime waiting for red lights!",
        "Fun fact: Honey never spoils!",
        "Interesting: The average cloud weighs about 1.1 million pounds!",
        "Cool fact: The average person walks the equivalent of three times around the world in a lifetime!",
        "Did you know? The average person spends 6 months of their lifetime waiting for red lights!"
      ]
    };
    
    const categoryFacts = funFacts[category as keyof typeof funFacts] || funFacts.other;
    return categoryFacts[Math.floor(Math.random() * categoryFacts.length)];
  }

  async identifySpecies(imageUri: string): Promise<SpeciesIdentification> {
    if (!this.apiKey) {
      console.warn('Using mock data since API key is not configured');
      return this.getMockSpecies();
    }

    try {
      // Get the base64 image data
      const base64Image = await this.getBase64FromUri(imageUri);
      
      // Use the correct model and format for the request
      const response = await this.genAI.models.generateContent({
        model: "gemini-1.5-pro",
        contents: [
          {
            role: "user",
            parts: [
              { text: "Identify this species. Provide the scientific name if possible, a brief description, and categorize it as plant, animal, fungus, geological, or other. Format your response with 'Name:' and 'Description:' labels." },
              { inlineData: { mimeType: "image/jpeg", data: base64Image } }
            ]
          }
        ]
      });

      const text = response.text();
      if (!text) {
        console.warn('No text generated from Gemini API, using mock data instead');
        return this.getMockSpecies();
      }

      return this.extractSpeciesInfo(text);
    } catch (error: any) {
      console.error('Error in species identification:', error);
      
      // Handle specific error cases
      if (error.message?.includes('INVALID_ARGUMENT')) {
        console.warn('Image format or size issue. Using mock data instead.');
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        console.warn('API key does not have access to Gemini API. Using mock data instead.');
      } else if (error.message?.includes('RESOURCE_EXHAUSTED')) {
        console.warn('API quota exceeded. Using mock data instead.');
      }
      
      return this.getMockSpecies();
    }
  }

  private extractSpeciesInfo(response: string): SpeciesIdentification {
    let name = 'Unknown Species';
    let description = 'Unable to identify this species.';
    let confidence = 0.7;
    let category: 'plant' | 'animal' | 'fungus' | 'geological' | 'other' = 'other';

    try {
      // Remove markdown formatting
      const cleanResponse = response.replace(/\*\*/g, '').replace(/\*/g, '');
      
      const nameMatch = cleanResponse.match(/(?:Name:|^)([^\n]+)/i);
      if (nameMatch?.[1]) {
        name = nameMatch[1].trim();
      }

      const descMatch = cleanResponse.match(/(?:Description:|^[^\n]+\n)([^\n]+(?:\n[^\n]+)*)/i);
      if (descMatch?.[1]) {
        description = descMatch[1].trim();
      }

      if (cleanResponse.toLowerCase().includes('plant') || cleanResponse.toLowerCase().includes('tree')) {
        category = 'plant';
      } else if (cleanResponse.toLowerCase().includes('animal') || cleanResponse.toLowerCase().includes('bird')) {
        category = 'animal';
      } else if (cleanResponse.toLowerCase().includes('fungus') || cleanResponse.toLowerCase().includes('mushroom')) {
        category = 'fungus';
      } else if (cleanResponse.toLowerCase().includes('rock') || cleanResponse.toLowerCase().includes('crystal')) {
        category = 'geological';
      }

      confidence = Math.min(0.7 + (description.length / 500), 0.98);
    } catch (error) {
      console.error('Error extracting species info:', error);
    }

    // Generate additional information
    const rarity = this.determineRarity(confidence, category);
    const funFact = this.generateFunFact(category);
    const brainrotDescription = this.generateBrainrotDescription(name, description, category);

    return {
      name,
      description,
      confidence,
      category,
      rarity,
      funFact,
      brainrotDescription
    };
  }

  private getMockSpecies(): SpeciesIdentification {
    const mockSpecies = [
      {
        name: 'Common Oak Tree (Quercus robur)',
        description: 'A large deciduous tree with lobed leaves and acorns. Common in woodland areas across Europe and parts of Asia.',
        confidence: 0.89,
        category: 'plant' as const,
      },
      {
        name: 'Eastern Gray Squirrel (Sciurus carolinensis)',
        description: 'A medium-sized rodent with a bushy tail. Native to eastern North America but introduced elsewhere.',
        confidence: 0.92,
        category: 'animal' as const,
      },
      {
        name: 'Common Dandelion (Taraxacum officinale)',
        description: 'A flowering plant with yellow flowers and seed heads that form a round "clock" of white tufted fruits.',
        confidence: 0.86,
        category: 'plant' as const,
      },
      {
        name: 'Fly Agaric Mushroom (Amanita muscaria)',
        description: 'A distinctive red mushroom with white spots. While iconic in appearance, it contains psychoactive compounds and is mildly toxic.',
        confidence: 0.88,
        category: 'fungus' as const,
      },
      {
        name: 'Rose Quartz',
        description: 'A pink variety of quartz often associated with love and healing in crystal therapy.',
        confidence: 0.78,
        category: 'geological' as const,
      }
    ];
    
    const randomSpecies = mockSpecies[Math.floor(Math.random() * mockSpecies.length)];
    
    return {
      ...randomSpecies,
      rarity: this.determineRarity(randomSpecies.confidence, randomSpecies.category),
      funFact: this.generateFunFact(randomSpecies.category),
      brainrotDescription: this.generateBrainrotDescription(randomSpecies.name, randomSpecies.description, randomSpecies.category)
    };
  }
}

// Create and export a singleton instance
const geminiVisionService = new GeminiVisionService();
export default geminiVisionService; 