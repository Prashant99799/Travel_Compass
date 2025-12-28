# Setup & Installation Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud like Neon, Supabase)
- Clerk account (https://clerk.com)

### Option 1: Docker Compose (Recommended)

```bash
# Clone/navigate to project
cd Travel_Compass

# Start all services
docker-compose up -d

# Wait for services to start (30-60 seconds)
# Then visit:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5432
```

### Option 2: Local Development

#### Prerequisites Check
```bash
# Check Node.js version
node --version  # Should be 20+

# Check npm version
npm --version   # Should be 9+
```

## 🔐 Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Go to **API Keys** section
4. Copy the **Publishable Key** and **Secret Key**

### Configure Environment Variables

#### Frontend (.env)
Create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_API_URL=http://localhost:3000
```

#### Backend (.env)
Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/compass
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

## 📝 New Features

### Posts & Reviews System
- Create posts (reviews, questions, tips, experiences, recommendations)
- View and filter posts by category
- Upvote/downvote posts
- Reply to posts with nested threads

### API Endpoints

#### User Routes (`/api/v1/user`)
- `POST /sync` - Sync Clerk user to database
- `GET /profile` - Get user profile
- `PATCH /profile` - Update profile
- `GET /posts` - Get user's posts

#### Posts Routes (`/api/v1/posts`)
- `GET /` - Get all posts (paginated)
- `POST /` - Create new post
- `GET /:postId` - Get single post
- `PATCH /:postId` - Update post
- `DELETE /:postId` - Delete post
- `GET /:postId/replies` - Get post replies
- `POST /:postId/replies` - Add reply

#### Votes Routes (`/api/v1/votes`)
- `POST /post/:postId` - Vote on post
- `DELETE /post/:postId` - Remove vote
- `POST /reply/:replyId` - Vote on reply

# Check PostgreSQL
psql --version  # Should be 15+
```

---

## 📦 Step-by-Step Installation

### 1. Database Setup

```bash
# Create database
createdb compass

# Or if using PostgreSQL Docker:
docker run --name compass-postgres \
  -e POSTGRES_USER=compass_user \
  -e POSTGRES_PASSWORD=compass_password \
  -e POSTGRES_DB=compass \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://compass_user:compass_password@localhost:5432/compass
PORT=3000
NODE_ENV=development
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
EOF

# Create database schema
npm run migrate

# Seed with demo data
npm run seed

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
EOF

# Start dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## ✅ Verification

### Backend Health Check

```bash
# Test API
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-01-15T10:30:00Z"
# }
```

### Database Connection

```bash
# Connect to database
psql postgresql://compass_user:compass_password@localhost:5432/compass

# List tables
\dt

# Expected tables:
# - users
# - destinations
# - seasonal_weather
# - tips
# - votes
# - travel_plans
```

### Frontend Check

Open `http://localhost:5173` in browser:
- ✅ See Compass logo in navigation
- ✅ Hero section visible
- ✅ Search button functional
- ✅ No console errors

---

## 🔧 Common Issues & Solutions

### Issue 1: "Database connection refused"

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running, start it:
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

### Issue 2: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in backend/.env:
PORT=3001
```

### Issue 3: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove package-lock.json
rm package-lock.json

# Try again
npm install
```

### Issue 4: "VITE not found"

**Solution:**
```bash
# Frontend requires Vite
cd frontend
npm install

# Check installation
npx vite --version
```

---

## 🌱 Seeding Sample Data

The database comes pre-seeded with:
- ✅ 10 Ahmedabad destinations
- ✅ Seasonal weather data
- ✅ 50+ travel tips
- ✅ Mock seasonal data

To reseed:
```bash
cd backend
npm run seed
```

---

## 📝 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/compass

# Server
PORT=3000
NODE_ENV=development

# Authentication (for future Clerk integration)
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
```

### Frontend (.env.local)
```bash
# API
VITE_API_BASE_URL=http://localhost:3000/api

# Auth (optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 🚀 Running the Full Stack

### Terminal 1: Database (if not using Docker)
```bash
# Ensure PostgreSQL is running
pg_isready
```

### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev

# Output:
# ╔════════════════════════════════════╗
# ║   🧭 Compass API Server Running    ║
# ║   Port: 3000                       ║
# ║   Env: development                 ║
# ╚════════════════════════════════════╝
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

---

## 📱 Testing the App

### 1. Homepage
```
http://localhost:5173/
✅ See hero section
✅ View trending tips
✅ Click "Explore Now"
```

### 2. Search Page
```
http://localhost:5173/search
✅ Enter search params
✅ Get recommendations
✅ View destination cards
```

### 3. Tips Page
```
http://localhost:5173/tips
✅ View all tips
✅ Vote on tips
✅ See seasonal filtering
```

### 4. API Testing
```bash
# Get recommendations
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "days": 3,
    "budget": 5000,
    "travelType": "solo",
    "season": "winter"
  }'

# Get destinations
curl http://localhost:3000/api/destinations

# Get trending tips
curl http://localhost:3000/api/search/trending
```

---

## 🐳 Docker Troubleshooting

### Check Container Status
```bash
docker-compose ps

# Output should show:
# - compass-db (running)
# - compass-api (running)
# - compass-web (running)
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs compass-api
docker-compose logs compass-web
docker-compose logs compass-db
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart compass-api
```

### Stop Everything
```bash
docker-compose down

# Including volumes
docker-compose down -v
```

---

## 📚 Development Workflow

### Making Changes

#### Frontend Changes
1. Edit files in `frontend/src/`
2. Vite auto-reloads
3. Check browser immediately

#### Backend Changes
1. Edit files in `backend/src/`
2. `tsx` watch auto-rebuilds
3. Server restarts automatically

#### Database Schema Changes
1. Edit `backend/src/db/schema.ts`
2. Run migrations: `npm run migrate`
3. Reseed if needed: `npm run seed`

### Building for Production

#### Frontend
```bash
cd frontend
npm run build

# Output in dist/ folder
# Ready for Vercel/Netlify deployment
```

#### Backend
```bash
cd backend
npm run build

# Output in dist/ folder
# Ready for Railway/Render deployment
```

---

## 🔍 Debugging

### Frontend Debugging
```bash
# Open browser DevTools (F12)
# Console shows React warnings
# Network tab shows API calls
# Application tab shows storage
```

### Backend Debugging
```bash
# Add debug logs
console.log('Debug info:', data);

# View in terminal running backend
# Check for TypeScript errors:
npm run type-check
```

---

## 📦 Project Size

```
frontend/     ~50 MB (with node_modules)
backend/      ~40 MB (with node_modules)
database/     ~10 MB (initial)
Total:        ~100 MB
```

---

## ✨ Next Steps After Setup

1. ✅ **Verify all endpoints work**
   - Test API with Postman/curl

2. ✅ **Create a test account**
   - Sign up on profile page

3. ✅ **Try search**
   - Search recommendations with different params

4. ✅ **Share a tip**
   - Post on tips page

5. ✅ **Explore the UI**
   - Check animations and responsiveness

---

## 🆘 Getting Help

### Check These Files
- [README.md](../README.md) - Overview
- [docs/API.md](../docs/API.md) - API Documentation
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System Design
- [docs/ML_MODELS.md](../docs/ML_MODELS.md) - ML Algorithms

### Common Commands

```bash
# Backend
npm run dev          # Start dev server
npm run build        # Build for production
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
npm run type-check   # Check TypeScript

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Run linter
```

---

## 🎉 You're All Set!

Your Compass application is ready! 🧭

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Database: postgresql://localhost:5432

Happy traveling! ✈️
