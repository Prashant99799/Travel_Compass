export type Season = 'summer' | 'monsoon' | 'autumn' | 'winter';
export type TravelType = 'solo' | 'couple' | 'family' | 'group';
export type PlanStatus = 'planned' | 'ongoing' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
  is_native: boolean;
  avatar_url?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

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
}

export interface Tip {
  id: string;
  user_id: string;
  destination_id: string;
  destination_name: string;
  content: string;
  image_url?: string;
  season: Season;
  tags: string[];
  upvotes: number;
  downvotes: number;
  featured: boolean;
  created_at: string;
}

export interface Recommendation {
  destination: Destination;
  matchScore: number;
  seasonalMatch: number;
  budgetFit: number;
  tips: Tip[];
  reasons: string[];
  confidence: number;
}

export interface SearchParams {
  days?: number;
  budget?: number;
  travelType?: TravelType;
  interests?: string[];
  season?: Season;
}

export interface TravelPlan {
  id: string;
  user_id: string;
  destination_id: string;
  budget: number;
  days: number;
  travel_type: TravelType;
  season: Season;
  start_date: string;
  end_date: string;
  status: PlanStatus;
  notes?: string;
  itinerary?: Record<string, any>;
}
