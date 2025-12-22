export type Season = 'summer' | 'monsoon' | 'autumn' | 'winter';

export type TravelType = 'solo' | 'couple' | 'family' | 'friends';

export interface SeasonalData {
  score: number;
  temp: string;
  description: string;
  activities: string[];
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  avgBudget: number;
  avgDays: number;
  popularity: number;
  tags: string[];
  highlights: string[];
  seasonal: Record<Season, SeasonalData>;
}

export interface RankedDestination {
  destination: Destination;
  score: number;
  matchQuality: 'excellent' | 'good' | 'fair' | 'poor';
  factors: string[];
}

export interface Tip {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  destinationId: string;
  destinationName: string;
  content: string;
  season: Season | null;
  tags: string[];
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface SearchParams {
  searchQuery?: string;
  budget?: number;
  days?: number;
  travelType?: TravelType;
  season: Season;
  categories?: string[];
}

