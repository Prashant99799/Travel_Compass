# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints requiring authentication should include:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Search & Recommendations

#### POST /search
Get AI-powered travel recommendations

**Request:**
```json
{
  "days": 3,
  "budget": 5000,
  "travelType": "solo",
  "season": "winter"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "destination": { ... },
      "matchScore": 85,
      "seasonalMatch": 0.95,
      "budgetFit": 0.88,
      "tips": [ ... ],
      "reasons": [ ... ],
      "confidence": 92
    }
  ],
  "currentSeason": "winter",
  "totalResults": 10
}
```

#### GET /search/trending
Get trending tips

**Response:**
```json
{
  "success": true,
  "tips": [ ... ],
  "count": 10
}
```

---

### Destinations

#### GET /destinations
List all destinations

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "destinations": [ ... ],
  "count": 20
}
```

#### GET /destinations/:id
Get single destination with seasonal data

**Response:**
```json
{
  "success": true,
  "destination": { ... },
  "seasonalData": [ ... ]
}
```

---

### Tips

#### GET /tips
List tips with optional filters

**Query Parameters:**
- `season` (optional): Filter by season
- `destination_id` (optional): Filter by destination

**Response:**
```json
{
  "success": true,
  "tips": [ ... ],
  "count": 50
}
```

#### POST /tips (Requires Auth)
Create a new tip

**Request:**
```json
{
  "destination_id": "uuid",
  "content": "Great tip about visiting...",
  "season": "winter",
  "tags": ["photography", "budget-friendly"]
}
```

**Response:**
```json
{
  "success": true,
  "tip": { ... }
}
```

#### POST /tips/:id/vote (Requires Auth)
Vote on a tip

**Request:**
```json
{
  "vote_type": "up"
}
```

**Response:**
```json
{
  "success": true,
  "tip": { ... }
}
```

#### DELETE /tips/:id (Requires Auth)
Delete a tip

**Response:**
```json
{
  "success": true,
  "message": "Tip deleted successfully"
}
```

---

### Travel Plans

#### GET /plans (Requires Auth)
Get user's travel plans

**Response:**
```json
{
  "success": true,
  "plans": [ ... ],
  "count": 5
}
```

#### POST /plans (Requires Auth)
Create a new travel plan

**Request:**
```json
{
  "destination_id": "uuid",
  "budget": 5000,
  "days": 3,
  "travel_type": "solo",
  "season": "winter",
  "start_date": "2024-01-15",
  "notes": "Budget trip"
}
```

**Response:**
```json
{
  "success": true,
  "plan": { ... }
}
```

---

### Authentication

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "clerk_id": "clerk_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

#### GET /auth/profile (Requires Auth)
Get current user profile

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [ ... ]
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Data Types

### Destination
```typescript
{
  id: string
  name: string
  description: string
  image_url: string
  category: string
  latitude: number
  longitude: number
  avg_budget: number
  avg_days: number
  popularity_score: number
  tags: string[]
  highlights: string[]
}
```

### Tip
```typescript
{
  id: string
  user_id: string
  destination_id: string
  destination_name: string
  content: string
  season: "summer" | "monsoon" | "autumn" | "winter"
  tags: string[]
  upvotes: number
  downvotes: number
  featured: boolean
  created_at: string
  updated_at: string
}
```

### Recommendation
```typescript
{
  destination: Destination
  matchScore: number  // 0-100
  seasonalMatch: number  // 0-1
  budgetFit: number  // 0-1
  tips: Tip[]
  reasons: string[]
  confidence: number  // 0-100
}
```
