# 🧭 TRAVEL COMPASS - Master Project Prompt
## Complete Implementation Guide with Enhanced Features

---

# 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema & Data Structures](#database-schema--data-structures)
4. [ML Models & Weight Criteria](#ml-models--weight-criteria)
5. [Core Algorithms](#core-algorithms)
6. [API Specifications](#api-specifications)
7. [Authentication (Simple)](#authentication-simple)
8. [Enhanced Features](#enhanced-features)
9. [Frontend Architecture](#frontend-architecture)
10. [Implementation Guide](#implementation-guide)

---

# 🎯 PROJECT OVERVIEW

Build a **production-ready, season-aware travel planning web application** for Ahmedabad with:
- **Hybrid AI recommendations** (rule-based + lightweight ML)
- **Community-driven content** (tips, reviews, discussions)
- **Intelligent search** with partial inputs
- **Real-time season detection** and destination scoring
- **Travel planning** with itinerary generation

### What Makes This Unique
1. **Season Intelligence**: Deep integration of seasonal data in all recommendations
2. **Partial Input Search**: Works even with minimal user input (AI predicts missing fields)
3. **Hybrid ML**: Combines rule-based logic + trained ML models
4. **Community Wisdom**: Locals share tips that enhance AI recommendations
5. **Modern UX**: Glassmorphism design, smooth animations, responsive

---

# 🛠️ TECH STACK

## Frontend
```
Framework:     React 18+ with TypeScript
Styling:       Tailwind CSS 4
Routing:       React Router DOM v6
Animations:    Framer Motion
Icons:         Lucide React
State:         React Context API + useState
Date:          date-fns
HTTP:          Axios
```

## Backend
```
Runtime:       Node.js 20+ with TypeScript
Framework:     Express.js
Database:      PostgreSQL 15+
ORM:           Drizzle ORM
Validation:    Zod
Password:      bcryptjs (simple auth)
Session:       JWT tokens (simple)
```

## ML/AI Layer
```
Models:        Pure TypeScript (no external ML runtime)
Budget:        Linear Regression
Ranking:       Multi-factor Weighted Scoring
Season:        Rule-based Classification
```

---

# 📊 DATABASE SCHEMA & DATA STRUCTURES

## Entity Relationship Diagram
```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   USERS     │────<│   TRAVEL_PLANS   │>────│ DESTINATIONS │
└─────────────┘     └──────────────────┘     └──────────────┘
       │                                            │
       │                                            │
       ▼                                            ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    TIPS     │>────│    TIP_VOTES     │     │ SEASONAL_WEATHER │
└─────────────┘     └──────────────────┘     └──────────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   POSTS     │────<│   POST_VOTES     │     │    REPLIES       │
└─────────────┘     └──────────────────┘     └──────────────────┘
```

## Complete Schema Definition

### 1. Users Table
```typescript
// Data Structure: User
interface User {
  id: UUID;                    // Primary key, auto-generated
  email: string;               // Unique, for login
  password_hash: string;       // bcrypt hashed password
  name: string;                // Display name
  is_native: boolean;          // True if local to Ahmedabad
  avatar_url?: string;         // Profile picture URL
  bio?: string;                // User bio/description
  preferences: UserPreferences; // JSON preferences
  created_at: Date;
  updated_at: Date;
}

interface UserPreferences {
  favorite_categories: string[];  // ['Historical', 'Food', 'Recreation']
  budget_preference: 'budget' | 'moderate' | 'luxury';
  travel_style: 'solo' | 'couple' | 'family' | 'group';
  interests: string[];           // ['photography', 'architecture', 'food']
}

// SQL Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_native BOOLEAN DEFAULT false,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. Destinations Table
```typescript
// Data Structure: Destination
interface Destination {
  id: UUID;
  name: string;                 // "Sabarmati Ashram"
  description: string;          // Detailed description
  image_url: string;            // Main image
  category: DestinationCategory;
  latitude: number;             // For mapping
  longitude: number;
  avg_budget: number;           // Average cost in INR
  avg_days: number;             // Recommended days to spend
  popularity_score: number;     // 0-100, updated based on engagement
  tags: string[];               // ['heritage', 'free-entry', 'family-friendly']
  highlights: string[];         // Key attractions within destination
  opening_hours?: string;       // "9 AM - 6 PM"
  best_time_to_visit?: string;  // "Morning for peace"
  entry_fee?: number;           // In INR, 0 for free
  created_at: Date;
}

type DestinationCategory = 
  | 'Historical' 
  | 'Cultural' 
  | 'Recreation' 
  | 'Religious' 
  | 'Food' 
  | 'Shopping' 
  | 'Nature' 
  | 'Architecture'
  | 'Entertainment';

// SQL Schema
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  avg_budget INTEGER DEFAULT 0,
  avg_days INTEGER DEFAULT 1,
  popularity_score INTEGER DEFAULT 50,
  tags TEXT[],
  highlights TEXT[],
  opening_hours VARCHAR(100),
  best_time_to_visit VARCHAR(255),
  entry_fee INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_destinations_popularity ON destinations(popularity_score DESC);
```

### 3. Seasonal Weather Table
```typescript
// Data Structure: SeasonalWeather
// This is the CRITICAL table for season-aware recommendations
interface SeasonalWeather {
  id: UUID;
  destination_id: UUID;         // FK to destinations
  season: Season;               // 'summer' | 'monsoon' | 'autumn' | 'winter'
  avg_temp: number;             // Average temperature in Celsius
  humidity: number;             // Percentage (0-100)
  rainfall: number;             // mm per month
  comfort_score: number;        // 0-100 (how comfortable to visit)
  seasonal_score: number;       // 0-100 (overall season rating for this destination)
  description: string;          // "Perfect weather for outdoor activities"
  best_activities: string[];    // Activities suited for this season
}

type Season = 'summer' | 'monsoon' | 'autumn' | 'winter';

// SQL Schema
CREATE TABLE seasonal_weather (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  season VARCHAR(20) NOT NULL,
  avg_temp INTEGER,
  humidity INTEGER,
  rainfall INTEGER,
  comfort_score INTEGER DEFAULT 50,
  seasonal_score INTEGER DEFAULT 50,
  description TEXT,
  best_activities TEXT[],
  UNIQUE(destination_id, season)
);

CREATE INDEX idx_seasonal_destination ON seasonal_weather(destination_id);
CREATE INDEX idx_seasonal_season ON seasonal_weather(season);
```

### 4. Tips Table
```typescript
// Data Structure: Tip
// User-generated content that enriches recommendations
interface Tip {
  id: UUID;
  user_id: UUID;                // Who created this tip
  destination_id: UUID;         // Which destination
  destination_name: string;     // Denormalized for quick access
  content: string;              // The actual tip text
  image_url?: string;           // Optional image
  season?: Season;              // Season-specific tip
  tags: string[];               // ['budget-friendly', 'hidden-gem']
  upvotes: number;              // Positive votes
  downvotes: number;            // Negative votes
  featured: boolean;            // Editor's pick
  created_at: Date;
  updated_at: Date;
}

// SQL Schema
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  destination_id UUID REFERENCES destinations(id) NOT NULL,
  destination_name VARCHAR(255),
  content TEXT NOT NULL,
  image_url TEXT,
  season VARCHAR(20),
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tips_destination ON tips(destination_id);
CREATE INDEX idx_tips_season ON tips(season);
CREATE INDEX idx_tips_featured ON tips(featured) WHERE featured = true;
CREATE INDEX idx_tips_score ON tips((upvotes - downvotes) DESC);
```

### 5. Votes Table
```typescript
// Data Structure: Vote
// Tracks user voting to prevent duplicate votes
interface Vote {
  id: UUID;
  user_id: UUID;
  tip_id: UUID;
  vote_type: 'UP' | 'DOWN';
  created_at: Date;
}

// SQL Schema
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  tip_id UUID REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  vote_type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tip_id)  -- One vote per user per tip
);
```

### 6. Posts Table (Community Forum)
```typescript
// Data Structure: Post
// For reviews, questions, discussions
interface Post {
  id: UUID;
  title: string;
  content: string;
  tag: PostTag;
  destination_id?: UUID;        // Optional - can be general
  destination_name?: string;
  created_by: UUID;
  is_edited: boolean;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  created_at: Date;
  updated_at: Date;
}

type PostTag = 'review' | 'question' | 'tip' | 'experience' | 'recommendation';

// SQL Schema
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tag VARCHAR(50) DEFAULT 'review',
  destination_id UUID REFERENCES destinations(id),
  destination_name VARCHAR(255),
  created_by UUID REFERENCES users(id) NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_destination ON posts(destination_id);
CREATE INDEX idx_posts_tag ON posts(tag);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

### 7. Replies Table
```typescript
// Data Structure: Reply
// Nested replies support for discussions
interface Reply {
  id: UUID;
  post_id: UUID;
  content: string;
  created_by: UUID;
  parent_reply_id?: UUID;       // For nested replies
  is_edited: boolean;
  upvotes: number;
  downvotes: number;
  created_at: Date;
  updated_at: Date;
}

// SQL Schema
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  parent_reply_id UUID REFERENCES replies(id),
  is_edited BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_replies_post ON replies(post_id);
```

### 8. Travel Plans Table
```typescript
// Data Structure: TravelPlan
// User's saved travel plans
interface TravelPlan {
  id: UUID;
  user_id: UUID;
  destination_id: UUID;
  budget: number;
  days: number;
  travel_type: TravelType;
  season: Season;
  start_date?: Date;
  end_date?: Date;
  status: PlanStatus;
  notes?: string;
  itinerary: ItineraryDay[];    // Generated or custom
  created_at: Date;
  updated_at: Date;
}

type TravelType = 'solo' | 'couple' | 'family' | 'group';
type PlanStatus = 'draft' | 'planned' | 'ongoing' | 'completed' | 'cancelled';

interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
  estimated_cost: number;
  notes?: string;
}

interface Activity {
  time: string;           // "09:00 AM"
  activity: string;       // "Visit Sabarmati Ashram"
  location: string;
  duration: string;       // "2 hours"
  cost: number;
  tips?: string[];
}

// SQL Schema
CREATE TABLE travel_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  destination_id UUID REFERENCES destinations(id) NOT NULL,
  budget INTEGER,
  days INTEGER,
  travel_type VARCHAR(20),
  season VARCHAR(20),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  itinerary JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plans_user ON travel_plans(user_id);
CREATE INDEX idx_plans_status ON travel_plans(status);
```

### 9. Bookmarks Table (NEW)
```typescript
// Data Structure: Bookmark
// Users can save destinations for later
interface Bookmark {
  id: UUID;
  user_id: UUID;
  destination_id: UUID;
  notes?: string;
  created_at: Date;
}

// SQL Schema
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);
```

### 10. User Activity Table (NEW - For Analytics)
```typescript
// Data Structure: UserActivity
// Track user behavior for better recommendations
interface UserActivity {
  id: UUID;
  user_id?: UUID;              // Can be null for anonymous
  session_id: string;          // Track anonymous users
  activity_type: ActivityType;
  destination_id?: UUID;
  metadata: Record<string, any>;
  created_at: Date;
}

type ActivityType = 
  | 'search' 
  | 'view_destination' 
  | 'view_tip' 
  | 'create_plan' 
  | 'vote' 
  | 'bookmark';

// SQL Schema
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON user_activity(user_id);
CREATE INDEX idx_activity_type ON user_activity(activity_type);
CREATE INDEX idx_activity_destination ON user_activity(destination_id);
```

---

# 🤖 ML MODELS & WEIGHT CRITERIA

## 1. Budget Predictor Model

### Purpose
Predict travel budget when user doesn't provide one, enabling search with partial inputs.

### Algorithm: Linear Regression
```
Budget = β₀ + β₁(days) + β₂(travel_type) + β₃(season_score) + β₄(popularity)
```

### Feature Engineering

```typescript
interface MLFeatures {
  days: number;                    // 1-30 days
  travelType: number;              // Encoded: solo=0, couple=1, family=2, group=3
  seasonScore: number;             // 0-100 comfort score
  destinationPopularity: number;   // 0-100 popularity
}

// Travel Type Encoding (affects budget multiplier)
const TRAVEL_TYPE_ENCODING = {
  solo: 0,      // Base cost - 1x multiplier
  couple: 1,    // 1.5x accommodation, 1.2x food
  family: 2,    // 2x accommodation, 1.8x food
  group: 3,     // 2.5x but split costs, so effectively 0.8x per person
};

// Season Score (affects pricing due to demand)
const SEASON_SCORES = {
  summer: 40,   // Low season - cheaper
  monsoon: 60,  // Mid season
  autumn: 85,   // High season - premium
  winter: 95,   // Peak season - most expensive
};
```

### Model Weights (Pre-trained)

```typescript
const BUDGET_WEIGHTS = {
  intercept: 5000,      // Base budget (INR) - minimum viable trip
  days: 800,            // Per day cost (INR)
  travelType: 1500,     // Per category increase
  seasonScore: 20,      // Premium per season point
  popularity: 15,       // Popular places cost more
};

// Why these weights?
// intercept: 5000 - Covers basic transport to reach Ahmedabad
// days: 800 - Average daily expense (food: 500, misc: 300)
// travelType: 1500 - Couple needs better rooms, family needs bigger spaces
// seasonScore: 20 - Peak season has 50 point premium = ₹1000 extra
// popularity: 15 - Popular spots have higher prices nearby
```

### Implementation

```typescript
function predictBudget(features: MLFeatures): number {
  const rawBudget = 
    BUDGET_WEIGHTS.intercept +
    BUDGET_WEIGHTS.days * features.days +
    BUDGET_WEIGHTS.travelType * features.travelType +
    BUDGET_WEIGHTS.seasonScore * features.seasonScore +
    BUDGET_WEIGHTS.popularity * features.destinationPopularity;
  
  // Clamp to reasonable range
  return Math.max(3000, Math.min(100000, Math.round(rawBudget)));
}

// Example:
// Input: { days: 3, travelType: 1 (couple), seasonScore: 95, popularity: 80 }
// Budget = 5000 + (800×3) + (1500×1) + (20×95) + (15×80)
//        = 5000 + 2400 + 1500 + 1900 + 1200
//        = ₹12,000
```

---

## 2. Destination Ranker Model

### Purpose
Rank and score destinations based on user context and preferences.

### Algorithm: Multi-Factor Weighted Scoring

```
Final Score = (Seasonal Fit × 0.40) + (Budget Fit × 0.30) + (Popularity Fit × 0.30)
```

### Weight Breakdown & Rationale

```typescript
const RANKING_WEIGHTS = {
  seasonal: 0.40,    // 40% - Season is PRIMARY factor (core feature!)
  budget: 0.30,      // 30% - Budget compatibility
  popularity: 0.30,  // 30% - Community validation
};

// WHY 40-30-30?
// - Season (40%): Our USP! Wrong season = bad experience regardless of budget
// - Budget (30%): User satisfaction depends heavily on affordability
// - Popularity (30%): Social proof and community validation
```

### Scoring Functions

```typescript
// 1. Seasonal Fitness (0-1)
function calculateSeasonalFit(
  destinationSeasonScore: number,  // From seasonal_weather table
  threshold: number = 60           // Minimum acceptable score
): number {
  if (destinationSeasonScore < threshold) {
    // Below threshold: heavy penalty
    return destinationSeasonScore / (threshold * 2);
  }
  // Above threshold: normalize to 0.5-1 range
  return 0.5 + (destinationSeasonScore - threshold) / (100 - threshold) * 0.5;
}

// Example:
// Score 90 (great): (90-60)/(100-60)*0.5 + 0.5 = 0.875
// Score 60 (ok):    (60-60)/(100-60)*0.5 + 0.5 = 0.5
// Score 40 (bad):   40/(60*2) = 0.33


// 2. Budget Fitness (0-1)
function calculateBudgetFit(
  destinationBudget: number,
  userBudget?: number
): number {
  if (!userBudget) return 0.5;  // No preference = neutral
  
  const ratio = destinationBudget / userBudget;
  
  if (ratio <= 1) {
    // Under budget: Good! Scale from 0.7 to 1.0
    return 0.7 + (1 - ratio) * 0.3;
  } else {
    // Over budget: Penalize exponentially
    return Math.max(0, 1 - Math.pow(ratio - 1, 2) * 2);
  }
}

// Example:
// User: ₹10,000, Destination: ₹8,000 → 0.7 + (1-0.8)*0.3 = 0.76
// User: ₹10,000, Destination: ₹10,000 → 0.7
// User: ₹10,000, Destination: ₹12,000 → 1 - (0.2)²×2 = 0.92
// User: ₹10,000, Destination: ₹15,000 → 1 - (0.5)²×2 = 0.5


// 3. Popularity Fitness (0-1)
function calculatePopularityFit(popularityScore: number): number {
  // Simple normalization
  return Math.min(popularityScore / 100, 1);
}


// 4. Final Score Calculation
function calculateFinalScore(
  seasonalFit: number,
  budgetFit: number,
  popularityFit: number
): number {
  const score = 
    seasonalFit * RANKING_WEIGHTS.seasonal +
    budgetFit * RANKING_WEIGHTS.budget +
    popularityFit * RANKING_WEIGHTS.popularity;
  
  return Math.round(score * 100);  // 0-100 scale
}
```

### Confidence Score

```typescript
// Confidence indicates how reliable the recommendation is
function calculateConfidence(
  seasonalFit: number,
  budgetFit: number,
  hasRelevantTips: boolean,
  userHasPreferences: boolean
): number {
  let confidence = (seasonalFit + budgetFit) / 2;
  
  // Boost if we have community validation
  if (hasRelevantTips) confidence += 0.10;
  
  // Boost if user gave us more info to work with
  if (userHasPreferences) confidence += 0.05;
  
  return Math.min(Math.round(confidence * 100), 100);
}
```

---

## 3. Season Detection System

### Rule-Based Classification

```typescript
interface SeasonDefinition {
  months: number[];        // 0-indexed (January = 0)
  tempRange: { min: number; max: number };
  description: string;
  icon: string;
  gradient: string;
  comfortScore: number;
}

const SEASONS: Record<Season, SeasonDefinition> = {
  summer: {
    months: [2, 3, 4],        // March, April, May
    tempRange: { min: 25, max: 45 },
    description: 'Hot and dry. Best avoided for outdoor activities.',
    icon: '☀️',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    comfortScore: 40,
  },
  monsoon: {
    months: [5, 6, 7],        // June, July, August
    tempRange: { min: 25, max: 35 },
    description: 'Rainy with humid conditions. Indoor attractions preferred.',
    icon: '🌧️',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    comfortScore: 60,
  },
  autumn: {
    months: [8, 9],           // September, October
    tempRange: { min: 20, max: 32 },
    description: 'Pleasant post-monsoon weather. Great for sightseeing.',
    icon: '🍂',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    comfortScore: 85,
  },
  winter: {
    months: [10, 11, 0, 1],   // November, December, January, February
    tempRange: { min: 10, max: 28 },
    description: 'Best time to visit! Perfect weather for everything.',
    icon: '❄️',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    comfortScore: 95,
  },
};

function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();
  
  for (const [season, info] of Object.entries(SEASONS)) {
    if (info.months.includes(month)) {
      return season as Season;
    }
  }
  
  return 'winter';  // Default fallback
}

function getSeasonInfo(season: Season): SeasonDefinition {
  return SEASONS[season];
}
```

---

# ⚙️ CORE ALGORITHMS

## 1. Hybrid Recommendation Algorithm

```typescript
interface SearchParams {
  days?: number;
  budget?: number;
  travelType?: TravelType;
  season?: Season;
  categories?: string[];
  interests?: string[];
}

interface Recommendation {
  destination: Destination;
  matchScore: number;        // 0-100
  seasonalMatch: number;     // 0-1
  budgetFit: number;         // 0-1
  tips: Tip[];
  reasons: string[];
  confidence: number;        // 0-100
}

async function getRecommendations(params: SearchParams): Promise<Recommendation[]> {
  const startTime = Date.now();
  
  // STEP 1: Detect/Use Season
  const currentSeason = params.season || getCurrentSeason();
  
  // STEP 2: Predict missing parameters (AI fills gaps)
  let budget = params.budget;
  if (!budget && params.days) {
    budget = predictBudget({
      days: params.days,
      travelType: encodeTravelType(params.travelType || 'solo'),
      seasonScore: getSeasonComfortScore(currentSeason),
      destinationPopularity: 75,  // Use average
    });
  }
  
  // STEP 3: Fetch all destinations with seasonal data
  const destinations = await db.select().from(destinationsTable);
  const seasonalData = await db
    .select()
    .from(seasonalWeatherTable)
    .where(eq(seasonalWeatherTable.season, currentSeason));
  
  const seasonalMap = new Map(
    seasonalData.map(sw => [sw.destination_id, sw])
  );
  
  // STEP 4: Score and rank each destination
  const rankedDestinations = destinations
    .map(dest => {
      const seasonal = seasonalMap.get(dest.id);
      const seasonScore = seasonal?.seasonal_score || 50;
      
      const seasonalFit = calculateSeasonalFit(seasonScore);
      const budgetFit = calculateBudgetFit(dest.avg_budget, budget);
      const popularityFit = dest.popularity_score / 100;
      
      const matchScore = calculateFinalScore(seasonalFit, budgetFit, popularityFit);
      
      return {
        destination: dest,
        matchScore,
        seasonalFit,
        budgetFit,
      };
    })
    // STEP 5: Filter low scores
    .filter(item => item.matchScore >= 40)
    // STEP 6: Sort by score
    .sort((a, b) => b.matchScore - a.matchScore)
    // STEP 7: Take top N
    .slice(0, 10);
  
  // STEP 8: Enrich with tips and generate reasons
  const recommendations = await Promise.all(
    rankedDestinations.map(async item => {
      const tips = await getTopTipsForDestination(item.destination.id, currentSeason);
      const hasRelevantTips = tips.length > 0;
      
      const reasons = generateReasons(
        item.destination,
        currentSeason,
        item.seasonalFit,
        item.budgetFit,
        hasRelevantTips
      );
      
      const confidence = calculateConfidence(
        item.seasonalFit,
        item.budgetFit,
        hasRelevantTips,
        !!params.budget
      );
      
      return {
        destination: item.destination,
        matchScore: item.matchScore,
        seasonalMatch: item.seasonalFit,
        budgetFit: item.budgetFit,
        tips,
        reasons,
        confidence,
      };
    })
  );
  
  console.log(`Recommendations generated in ${Date.now() - startTime}ms`);
  return recommendations;
}
```

## 2. Reason Generation Algorithm

```typescript
function generateReasons(
  destination: Destination,
  season: Season,
  seasonalFit: number,
  budgetFit: number,
  hasRelevantTips: boolean
): string[] {
  const reasons: string[] = [];
  
  // Season-based reasons
  if (seasonalFit > 0.8) {
    reasons.push(`🌟 Perfect for ${season} season`);
  } else if (seasonalFit > 0.6) {
    reasons.push(`✓ Good choice for ${season}`);
  } else if (seasonalFit > 0.4) {
    reasons.push(`⚠️ Decent in ${season}, but not ideal`);
  }
  
  // Budget-based reasons
  if (budgetFit > 0.8) {
    reasons.push('💰 Matches your budget perfectly');
  } else if (budgetFit > 0.6) {
    reasons.push('💵 Within your budget range');
  } else if (budgetFit > 0.4) {
    reasons.push('💸 Slightly over budget');
  }
  
  // Popularity-based reasons
  if (destination.popularity_score > 80) {
    reasons.push('🔥 Highly rated by locals');
  } else if (destination.popularity_score > 60) {
    reasons.push('⭐ Popular local attraction');
  }
  
  // Category reason
  if (destination.category) {
    reasons.push(`🏛️ ${destination.category} experience`);
  }
  
  // Community validation
  if (hasRelevantTips) {
    reasons.push('💬 Community tips available');
  }
  
  // Entry fee reason
  if (destination.entry_fee === 0) {
    reasons.push('🆓 Free entry!');
  }
  
  return reasons.slice(0, 5);  // Return top 5 reasons
}
```

## 3. Voting Algorithm

```typescript
async function handleVote(
  userId: string,
  tipId: string,
  voteType: 'UP' | 'DOWN'
): Promise<{ upvotes: number; downvotes: number }> {
  // Check existing vote
  const existingVote = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.user_id, userId),
        eq(votes.tip_id, tipId)
      )
    )
    .limit(1);
  
  const tip = await db
    .select()
    .from(tips)
    .where(eq(tips.id, tipId))
    .limit(1);
  
  if (!tip[0]) throw new Error('Tip not found');
  
  let newUpvotes = tip[0].upvotes;
  let newDownvotes = tip[0].downvotes;
  
  if (existingVote.length > 0) {
    const currentVote = existingVote[0];
    
    if (currentVote.vote_type === voteType) {
      // Same vote - remove it (toggle off)
      await db.delete(votes).where(eq(votes.id, currentVote.id));
      
      if (voteType === 'UP') newUpvotes--;
      else newDownvotes--;
    } else {
      // Different vote - switch it
      await db
        .update(votes)
        .set({ vote_type: voteType })
        .where(eq(votes.id, currentVote.id));
      
      if (voteType === 'UP') {
        newUpvotes++;
        newDownvotes--;
      } else {
        newUpvotes--;
        newDownvotes++;
      }
    }
  } else {
    // New vote
    await db.insert(votes).values({
      user_id: userId,
      tip_id: tipId,
      vote_type: voteType,
    });
    
    if (voteType === 'UP') newUpvotes++;
    else newDownvotes++;
  }
  
  // Update tip counts
  await db
    .update(tips)
    .set({ upvotes: newUpvotes, downvotes: newDownvotes })
    .where(eq(tips.id, tipId));
  
  return { upvotes: newUpvotes, downvotes: newDownvotes };
}
```

## 4. Itinerary Generation Algorithm

```typescript
interface GenerateItineraryParams {
  destinationId: string;
  days: number;
  budget: number;
  travelType: TravelType;
  interests?: string[];
}

async function generateItinerary(params: GenerateItineraryParams): Promise<ItineraryDay[]> {
  const destination = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, params.destinationId))
    .limit(1);
  
  if (!destination[0]) throw new Error('Destination not found');
  
  // Get all destinations for multi-day trips
  const allDestinations = await db.select().from(destinations);
  
  const budgetPerDay = params.budget / params.days;
  const itinerary: ItineraryDay[] = [];
  
  for (let day = 1; day <= params.days; day++) {
    const dayActivities: Activity[] = [];
    let dayBudget = budgetPerDay;
    
    // Morning activity (9 AM - 12 PM)
    const morningDest = selectDestinationForSlot(
      allDestinations,
      'morning',
      dayBudget * 0.3,
      params.interests
    );
    
    if (morningDest) {
      dayActivities.push({
        time: '09:00 AM',
        activity: `Visit ${morningDest.name}`,
        location: morningDest.name,
        duration: '2-3 hours',
        cost: morningDest.entry_fee || 0,
        tips: await getQuickTips(morningDest.id),
      });
      dayBudget -= morningDest.entry_fee || 0;
    }
    
    // Lunch (12 PM - 2 PM)
    dayActivities.push({
      time: '12:30 PM',
      activity: 'Lunch at local restaurant',
      location: 'Local food area',
      duration: '1.5 hours',
      cost: params.travelType === 'family' ? 800 : 400,
    });
    dayBudget -= (params.travelType === 'family' ? 800 : 400);
    
    // Afternoon activity (2 PM - 5 PM)
    const afternoonDest = selectDestinationForSlot(
      allDestinations.filter(d => d.id !== morningDest?.id),
      'afternoon',
      dayBudget * 0.4,
      params.interests
    );
    
    if (afternoonDest) {
      dayActivities.push({
        time: '02:30 PM',
        activity: `Explore ${afternoonDest.name}`,
        location: afternoonDest.name,
        duration: '2-3 hours',
        cost: afternoonDest.entry_fee || 0,
      });
    }
    
    // Evening activity (5 PM - 8 PM)
    dayActivities.push({
      time: '05:30 PM',
      activity: 'Evening market visit / Street food',
      location: 'Law Garden / Manek Chowk',
      duration: '2-3 hours',
      cost: 500,
    });
    
    itinerary.push({
      day,
      title: `Day ${day}: ${morningDest?.category || 'Exploration'}`,
      activities: dayActivities,
      estimated_cost: calculateDayCost(dayActivities),
      notes: day === 1 
        ? 'Start early to beat the crowds!' 
        : day === params.days 
          ? 'Last day - don\'t forget souvenirs!' 
          : undefined,
    });
  }
  
  return itinerary;
}
```

---

# 📡 API SPECIFICATIONS

## Authentication Endpoints (Simple JWT)

### POST /api/auth/signup
```typescript
// Request
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "is_native": false
}

// Response (Success)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "is_native": false,
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}

// Response (Error)
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

### POST /api/auth/login
```typescript
// Request
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Response (Success)
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### GET /api/auth/me (Requires Auth)
```typescript
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

## Search & Recommendations

### POST /api/search
```typescript
// Request
{
  "days": 3,              // Optional
  "budget": 15000,        // Optional (will be predicted if missing)
  "travelType": "couple", // Optional: solo, couple, family, group
  "season": "winter",     // Optional (auto-detected)
  "categories": ["Historical", "Food"],  // Optional
  "interests": ["photography", "architecture"]  // Optional
}

// Response
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "destination": {
          "id": "uuid",
          "name": "Sabarmati Ashram",
          "description": "Historic ashram of Mahatma Gandhi...",
          "image_url": "https://...",
          "category": "Historical",
          "avg_budget": 500,
          "avg_days": 1,
          "popularity_score": 95,
          "tags": ["heritage", "free-entry", "must-visit"],
          "highlights": ["Gandhi's living quarters", "Museum"]
        },
        "matchScore": 92,
        "seasonalMatch": 0.95,
        "budgetFit": 0.88,
        "tips": [
          {
            "id": "uuid",
            "content": "Visit early morning for peaceful experience",
            "upvotes": 45,
            "downvotes": 2
          }
        ],
        "reasons": [
          "🌟 Perfect for winter season",
          "💰 Matches your budget perfectly",
          "🔥 Highly rated by locals",
          "🏛️ Historical experience",
          "🆓 Free entry!"
        ],
        "confidence": 94
      }
    ],
    "inferredParams": {
      "budget": 15000,
      "season": "winter"
    },
    "currentSeason": "winter",
    "totalResults": 10,
    "processingTime": 145
  }
}
```

### GET /api/search/trending
```typescript
// Response
{
  "success": true,
  "data": {
    "tips": [ ... ],
    "destinations": [ ... ]  // Most searched this week
  }
}
```

---

## Destinations

### GET /api/destinations
```typescript
// Query params: ?category=Historical&limit=20&offset=0

// Response
{
  "success": true,
  "data": {
    "destinations": [ ... ],
    "total": 25,
    "limit": 20,
    "offset": 0
  }
}
```

### GET /api/destinations/:id
```typescript
// Response
{
  "success": true,
  "data": {
    "destination": { ... },
    "seasonalData": [
      {
        "season": "winter",
        "seasonal_score": 95,
        "comfort_score": 95,
        "description": "Best time to visit!",
        "best_activities": ["Walking tours", "Photography"]
      }
    ],
    "topTips": [ ... ],
    "relatedDestinations": [ ... ]
  }
}
```

---

## Tips

### GET /api/tips
```typescript
// Query params: ?destination_id=uuid&season=winter&sort=popular&limit=20

// Response
{
  "success": true,
  "data": {
    "tips": [ ... ],
    "total": 100
  }
}
```

### POST /api/tips (Requires Auth)
```typescript
// Request
{
  "destination_id": "uuid",
  "content": "Visit during sunset for amazing photos!",
  "season": "winter",
  "tags": ["photography", "timing"]
}

// Response
{
  "success": true,
  "data": {
    "tip": { ... }
  }
}
```

### POST /api/tips/:id/vote (Requires Auth)
```typescript
// Request
{
  "vote_type": "UP"  // or "DOWN"
}

// Response
{
  "success": true,
  "data": {
    "upvotes": 46,
    "downvotes": 2,
    "userVote": "UP"
  }
}
```

---

## Posts (Community Forum)

### GET /api/posts
```typescript
// Query params: ?tag=review&destination_id=uuid&sort=recent

// Response
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "My 3-day Ahmedabad experience",
        "content": "...",
        "tag": "experience",
        "destination_name": "Sabarmati Ashram",
        "author": { "id": "uuid", "name": "John", "avatar_url": "..." },
        "upvotes": 25,
        "downvotes": 1,
        "reply_count": 8,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /api/posts (Requires Auth)
```typescript
// Request
{
  "title": "Best food spots in Old City",
  "content": "Here's my guide to the best food...",
  "tag": "recommendation",
  "destination_id": "uuid"  // Optional
}
```

### GET /api/posts/:id/replies
```typescript
// Response
{
  "success": true,
  "data": {
    "replies": [
      {
        "id": "uuid",
        "content": "Great post! I'd add...",
        "author": { ... },
        "upvotes": 5,
        "parent_reply_id": null,
        "nested_replies": [ ... ]  // Nested structure
      }
    ]
  }
}
```

---

## Travel Plans

### GET /api/plans (Requires Auth)
```typescript
// Response
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "uuid",
        "destination": { ... },
        "budget": 15000,
        "days": 3,
        "travel_type": "couple",
        "status": "planned",
        "start_date": "2024-02-01",
        "itinerary": [ ... ]
      }
    ]
  }
}
```

### POST /api/plans (Requires Auth)
```typescript
// Request
{
  "destination_id": "uuid",
  "budget": 15000,
  "days": 3,
  "travel_type": "couple",
  "start_date": "2024-02-01",
  "generate_itinerary": true  // Auto-generate or provide custom
}

// Response with generated itinerary
{
  "success": true,
  "data": {
    "plan": {
      "id": "uuid",
      "itinerary": [
        {
          "day": 1,
          "title": "Day 1: Heritage & Culture",
          "activities": [
            {
              "time": "09:00 AM",
              "activity": "Visit Sabarmati Ashram",
              "location": "Sabarmati Ashram",
              "duration": "2-3 hours",
              "cost": 0,
              "tips": ["Go early for peace", "Photography allowed"]
            }
          ],
          "estimated_cost": 2500
        }
      ]
    }
  }
}
```

---

## Bookmarks (Requires Auth)

### GET /api/bookmarks
### POST /api/bookmarks
### DELETE /api/bookmarks/:destination_id

---

## Seasonal Data

### GET /api/seasons
```typescript
// Response
{
  "success": true,
  "data": {
    "current": "winter",
    "seasons": {
      "winter": {
        "months": [11, 12, 1, 2],
        "description": "Best time to visit!",
        "icon": "❄️",
        "comfortScore": 95
      },
      // ... other seasons
    }
  }
}
```

### GET /api/seasons/:season/destinations
```typescript
// Get best destinations for a specific season

// Response
{
  "success": true,
  "data": {
    "season": "winter",
    "destinations": [
      {
        "destination": { ... },
        "seasonal_score": 95,
        "recommended_activities": ["Heritage walks", "Food tours"]
      }
    ]
  }
}
```

---

# 🔐 AUTHENTICATION (SIMPLE)

## JWT-Based Auth (No External Services)

### Password Hashing
```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### JWT Token Management
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

interface TokenPayload {
  userId: string;
  email: string;
}

function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
```

### Auth Middleware
```typescript
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication required' }
    });
  }
  
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
  
  // Verify user still exists
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);
  
  if (!user[0]) {
    return res.status(401).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User no longer exists' }
    });
  }
  
  req.user = { id: user[0].id, email: user[0].email };
  next();
}

// Optional auth - doesn't fail if no token, but attaches user if present
async function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (payload) {
      req.user = { id: payload.userId, email: payload.email };
    }
  }
  
  next();
}
```

---

# ✨ ENHANCED FEATURES

## 1. Smart Search with Partial Inputs
- User can search with just "3 days" and system predicts budget, suggests season-appropriate destinations
- AI fills in gaps using ML models

## 2. Community Forum (Posts & Replies)
- Users create posts: reviews, questions, tips, experiences
- Nested replies with voting
- Tag-based filtering
- Destination linking

## 3. Auto-Generated Itineraries
- Based on days, budget, travel type
- Considers destination proximity
- Includes meals and rest time
- Tips integrated into activities

## 4. Trending & Analytics
- Track popular destinations
- Seasonal trends
- User behavior analytics
- Personalized recommendations (future)

## 5. Bookmarking System
- Save destinations for later
- Add personal notes
- Quick access in profile

## 6. Season-Specific Content
- Tips filtered by season
- Destination scores change per season
- Visual season indicators
- Best time suggestions

## 7. Voting System
- Toggle voting (tap again to remove)
- Vote switching (up to down)
- Score = upvotes - downvotes
- Featured content selection

## 8. User Profiles
- Avatar, bio, preferences
- Travel history
- Created tips/posts
- Saved plans

---

# 🎨 FRONTEND ARCHITECTURE

## Page Structure
```
/                   → HomePage (hero, features, trending)
/search             → SearchPage (smart search, results)
/destinations       → DestinationsPage (browse all)
/destinations/:id   → DestinationDetailPage
/tips               → TipsPage (community tips)
/posts              → PostsPage (forum)
/posts/:id          → PostDetailPage (with replies)
/profile            → ProfilePage (user dashboard)
/plans              → PlansPage (travel plans)
/plans/:id          → PlanDetailPage
/login              → LoginPage
/signup             → SignupPage
```

## Component Library
```typescript
// UI Components
Button, Input, Select, Card, Modal, Loader, Badge, Avatar

// Layout Components
Layout, Navbar, Footer, Sidebar, PageContainer

// Feature Components
SearchPanel, RecommendationCard, DestinationCard
TipCard, PostCard, ReplyThread
PlanCard, ItineraryView, SeasonBadge
VoteButtons, BookmarkButton, ShareButton
```

## State Management
```typescript
// Context Structure
AuthContext: { user, token, login, logout, isAuthenticated }
SearchContext: { params, results, loading, search }
SeasonContext: { current, info, all }
```

---

# 🚀 IMPLEMENTATION GUIDE

## Phase 1: Foundation (Days 1-3)
1. Project setup (Vite, Express, TypeScript)
2. Database schema creation
3. Basic API structure
4. Authentication (signup/login)

## Phase 2: Core Backend (Days 4-7)
1. Destination CRUD
2. Seasonal data management
3. Tips CRUD with voting
4. Search & recommendation engine
5. ML models implementation

## Phase 3: Frontend Shell (Days 8-10)
1. Layout & navigation
2. Design system components
3. Authentication pages
4. Basic routing

## Phase 4: Feature Pages (Days 11-15)
1. HomePage
2. SearchPage with smart panel
3. TipsPage with filters
4. DestinationDetailPage
5. ProfilePage

## Phase 5: Advanced Features (Days 16-19)
1. Posts & replies
2. Travel plans & itineraries
3. Bookmarks
4. Trending section

## Phase 6: Polish (Days 20-21)
1. Animations
2. Error handling
3. Loading states
4. Mobile responsiveness
5. Testing

---

# 📊 SAMPLE DATA (Ahmedabad)

## Destinations
1. **Sabarmati Ashram** - Historical | Winter: 95, Summer: 60 | Free
2. **Kankaria Lake** - Recreation | Winter: 100, Summer: 50 | ₹25
3. **Adalaj Stepwell** - Architecture | Winter: 95, Summer: 70 | Free
4. **Law Garden Market** - Shopping | Winter: 85, Monsoon: 40 | Free
5. **Manek Chowk** - Food | All seasons: 80+ | ₹0
6. **Science City** - Entertainment | All seasons: 75+ | ₹150
7. **Calico Museum** - Culture | All seasons: 70+ | Free
8. **Sarkhej Roza** - Historical | Winter: 90, Summer: 65 | Free
9. **ISKCON Temple** - Religious | All seasons: 80+ | Free
10. **Akshardham Temple** - Religious | Winter: 95, Summer: 70 | Free

## Sample Tips
- "Visit Kankaria Lake at sunset during winter - magical views! 🌅"
- "Manek Chowk food stalls open after 9 PM - best street food in city 🍴"
- "Sabarmati Ashram is free entry, go early morning for peace 🕊️"
- "Avoid Old City walks during summer afternoons - too hot! ☀️"
- "Law Garden market on Thursdays has special handicraft section 🎨"

---

# ⚙️ ENVIRONMENT VARIABLES

```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/compass
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
```

---

# 🎯 SUCCESS METRICS

## User Engagement
- Session duration > 4 minutes
- Tips created per user > 1
- Search completion > 70%

## ML Performance
- Budget prediction accuracy > 75%
- Recommendation relevance > 80%
- Season matching > 95%

## Technical
- Page load < 3 seconds
- API response < 500ms
- Mobile score > 85

---

**This is your complete blueprint. Start building! 🚀**
