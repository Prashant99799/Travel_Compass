// Core Types
export type Season = 'summer' | 'monsoon' | 'autumn' | 'winter';
export type TravelType = 'solo' | 'couple' | 'family' | 'group';
export type PlanStatus = 'planned' | 'ongoing' | 'completed';
export type VoteType = 'up' | 'down';

// User
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  is_native: boolean;
  avatar_url: string | null;
  bio: string | null;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

// Destination
export interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  latitude: number;
  longitude: number;
  avg_budget: number;
  avg_days: number;
  popularity_score: number;
  tags: string[];
  highlights: string[];
  created_at: Date;
}

// Seasonal Weather
export interface SeasonalWeather {
  id: string;
  destination_id: string;
  season: Season;
  avg_temp: number;
  humidity: number;
  rainfall: number;
  comfort_score: number;
  seasonal_score: number;
  description: string;
  best_activities: string[];
}

// Tips
export interface Tip {
  id: string;
  user_id: string;
  destination_id: string;
  destination_name: string | null;
  content: string;
  image_url: string | null;
  season: string | null;
  tags: string[] | null;
  upvotes: number | null;
  downvotes: number | null;
  featured: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// Travel Plan
export interface TravelPlan {
  id: string;
  user_id: string;
  destination_id: string;
  budget: number;
  days: number;
  travel_type: TravelType;
  season: Season;
  start_date: Date;
  end_date: Date;
  status: PlanStatus;
  notes: string | null;
  itinerary: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

// Search/ML Types
export interface SearchParams {
  days?: number;
  budget?: number;
  travelType?: TravelType;
  interests?: string[];
  season?: Season;
}

export interface MLFeatures {
  days: number;
  travelType: number;
  seasonScore: number;
  destinationPopularity: number;
}

export interface RankedDestination {
  destination: Destination;
  matchScore: number;
  seasonalMatch: number;
  budgetFit: number;
}

export interface Recommendation extends RankedDestination {
  tips: Tip[];
  reasons: string[];
  confidence: number;
}

export interface SearchResult {
  query: SearchParams;
  recommendations: Recommendation[];
  inferredParams: Partial<SearchParams>;
  currentSeason: Season;
  totalResults: number;
  processingTime: number;
}
