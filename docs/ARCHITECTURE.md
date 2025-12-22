# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Pages: Home, Search, Tips, Profile                  │  │
│  │  Components: Reusable UI, Layout, Feed               │  │
│  │  Services: API Client, Storage                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   Routes       │  │   Services     │  │  Middleware  │  │
│  │ - Search       │  │ - Recommend    │  │ - Auth       │  │
│  │ - Tips         │  │ - Season       │  │ - Validate   │  │
│  │ - Destinations │  │ - Tips         │  │ - Error      │  │
│  │ - Plans        │  │               │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           ML Layer (TypeScript)                     │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ Budget Predictor | Destination Ranker       │  │   │
│  │  │ Inference Engine | Feature Engineering      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ Queries/Commands
┌─────────────────────────────────────────────────────────────┐
│         Database (PostgreSQL) + ORM (Drizzle)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ users | destinations | seasonal_weather             │  │
│  │ tips | votes | travel_plans                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Components Hierarchy
```
App
├── HomePage
│   ├── Hero Section
│   ├── Features Grid
│   └── Trending Tips Carousel
├── SearchPage
│   ├── SearchPanel
│   │   ├── Input Fields
│   │   └── Filter Options
│   └── RecommendationGrid
│       └── RecommendationCard
├── TipsPage
│   ├── Filter Tabs
│   ├── TipFeed
│   │   └── TipCard
│   └── CreateTipModal
└── ProfilePage
    ├── User Info Card
    ├── Statistics
    └── Preferences
```

### State Management
- **React Context API** for auth state
- **Local State** (useState) for component state
- **React Query** (future) for caching

### Data Flow
```
Component → Event Handler → API Service → Backend
     ↓                            ↓
  Update State            Database Query
     ↓
  Re-render Component
```

## Backend Architecture

### Request Processing Pipeline
```
HTTP Request
    ↓
CORS Middleware
    ↓
Auth Middleware
    ↓
Route Handler
    ↓
Validation Middleware
    ↓
Business Logic (Services)
    ↓
Database Query (Drizzle ORM)
    ↓
Response
```

### Service Layer
```
Routes (Express Router)
    ↓
├── TipsService
│   ├── createTip()
│   ├── getTips()
│   ├── voteTip()
│   └── deleteTip()
├── RecommendationService
│   ├── getRecommendations()
│   ├── getTrendingTips()
│   └── getTipsForDestination()
└── SeasonService
    ├── getCurrentSeason()
    ├── getSeasonInfo()
    └── isDateInSeason()
```

## ML Pipeline

### Recommendation Flow
```
User Input (days, budget, travel_type, season)
    ↓
CreateMLFeatures()
    ↓
├── BudgetPredictor
│   └── predictBudget() → Estimated Budget
├── InferenceEngine
│   ├── calculateSeasonalFitness()
│   ├── calculateBudgetFitness()
│   └── calculatePopularityFitness()
└── DestinationRanker
    └── calculateDestinationScore()
    ↓
Get Top 10 Destinations
    ↓
Fetch Tips & Generate Reasons
    ↓
Return Recommendations
```

### Model Weights
```typescript
budgetWeights = {
  intercept: 5000,      // Base budget
  days: 800,            // Cost per day
  travelType: 1500,     // Travel type factor
  seasonScore: 20,      // Season comfort factor
  popularity: 15        // Destination popularity factor
}
```

## Database Schema

### Tables & Relationships
```
users (PK: id)
  ├── email (UNIQUE)
  ├── clerk_id (UNIQUE)
  └── preferences (JSONB)

destinations (PK: id)
  ├── name
  ├── category
  ├── avg_budget
  └── popularity_score

seasonal_weather (PK: id)
  ├── destination_id (FK) → destinations
  ├── season (Enum)
  ├── seasonal_score
  └── best_activities (Array)

tips (PK: id)
  ├── user_id (FK) → users
  ├── destination_id (FK) → destinations
  ├── season (Enum)
  └── upvotes, downvotes

votes (PK: id, UNIQUE: user_id + tip_id)
  ├── user_id (FK) → users
  ├── tip_id (FK) → tips
  └── vote_type (Enum: up|down)

travel_plans (PK: id)
  ├── user_id (FK) → users
  ├── destination_id (FK) → destinations
  ├── budget, days
  ├── start_date, end_date
  └── status (Enum)
```

### Indexes
```sql
CREATE INDEX idx_tips_season ON tips(season)
CREATE INDEX idx_tips_destination ON tips(destination_id)
CREATE INDEX idx_tips_featured ON tips(featured) WHERE featured = true
CREATE INDEX idx_destinations_category ON destinations(category)
CREATE INDEX idx_travel_plans_user ON travel_plans(user_id)
CREATE INDEX idx_clerk_id ON users(clerk_id)
CREATE INDEX idx_email ON users(email)
```

## Deployment Architecture

### Development
```
Local Machine
├── Frontend Dev Server (Vite) → port 5173
├── Backend Dev Server (tsx watch) → port 3000
└── Database (PostgreSQL) → port 5432
```

### Production
```
Frontend (Vercel)
    ↓
CDN (Vercel Edge)
    ↓
Backend (Railway/Render)
    ↓
Database (Neon PostgreSQL)
    ↓
Object Storage (S3/R2) for images
```

## Scalability Considerations

### Caching Strategy
- Redis for:
  - Seasonal recommendations cache
  - Trending tips cache
  - User session data

### Database Optimization
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Partitioning tips by season

### Frontend Optimization
- Code splitting with React Router
- Lazy loading images
- Service Worker for offline mode
- CDN for static assets

## Security Architecture

```
Request
  ↓
Rate Limiter (100/min per IP)
  ↓
Input Validation (Zod)
  ↓
Authentication Check
  ↓
Authorization Check
  ↓
SQL Injection Prevention (Drizzle ORM)
  ↓
CORS Policy
  ↓
Response
```

## Monitoring & Logging

### Key Metrics
- API response time
- Database query performance
- ML model inference time
- User engagement
- Error rates

### Logging Stack
```
Application Logs → Winston → CloudWatch/Datadog
                ↓
              Alerts
                ↓
          Slack/Email
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ Security
- ✅ Reliability
